import { CartItem } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const INFINITEPAY_API =
    "https://api.checkout.infinitepay.io/links";

const SHIPPING = 25;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const items: CartItem[] = body.items;
        const customer = body.customer;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Carrinho vazio.",
                },
                { status: 400 }
            );
        }

        if (!customer || typeof customer !== "object") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Dados do cliente inválidos.",
                },
                { status: 400 }
            );
        }

        /*
         * Valida os itens recebidos.
         */
        for (const item of items) {
            if (
                typeof item.id !== "string" ||
                !item.id ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Itens do carrinho inválidos.",
                    },
                    { status: 400 }
                );
            }
        }

        /*
         * O ID do carrinho possui o formato:
         *
         * plantId::baseId
         */
        const productIds = new Set<string>();

        for (const item of items) {
            const [plantId, baseId] = item.id.split("::");

            if (!plantId || !baseId) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Item inválido: ${item.id}`,
                    },
                    { status: 400 }
                );
            }

            productIds.add(plantId);
            productIds.add(baseId);
        }

        const supabase = await createClient();

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Usuário não autenticado.",
                },
                { status: 401 }
            );
        }

        /*
         * Busca todas as plantas e bases necessárias
         * em uma única consulta.
         */
        const { data: products, error } = await supabase
            .schema("scmold")
            .from("product")
            .select("product_id, name, price")
            .in("product_id", Array.from(productIds));

        if (error) {
            console.error("Supabase error:", error);

            return NextResponse.json(
                {
                    success: false,
                    error: "Erro ao consultar produtos.",
                },
                { status: 500 }
            );
        }

        if (!products || products.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Produtos não encontrados.",
                },
                { status: 400 }
            );
        }

        /*
         * Verifica se TODOS os IDs solicitados
         * foram encontrados no banco.
         */
        if (products.length !== productIds.size) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Um ou mais produtos não foram encontrados.",
                },
                { status: 400 }
            );
        }

        /*
         * Cria um Map para evitar vários .find().
         */
        const productMap = new Map(
            products.map((product) => [
                product.product_id,
                product,
            ])
        );

        /*
         * Monta os itens do pedido.
         *
         * O preço unitário do setup é:
         *
         * preço da planta + preço da base
         */
        const orderItems = items.map((cartItem) => {
            const [plantId, baseId] = cartItem.id.split("::");

            const plant = productMap.get(plantId);
            const base = productMap.get(baseId);

            if (!plant || !base) {
                throw new Error(
                    `Produto não encontrado para o item ${cartItem.id}.`
                );
            }

            const unitPrice =
                Number(plant.price) + Number(base.price);

            const subtotal =
                unitPrice * cartItem.quantity;

            return {
                plantId,
                baseId,
                plantName: plant.name,
                baseName: base.name,
                quantity: cartItem.quantity,
                unitPrice,
                subtotal,
            };
        });

        /*
         * Calcula os valores no backend.
         *
         * Nunca confiamos no total enviado pelo frontend.
         */
        const subtotal = orderItems.reduce(
            (total, item) => total + item.subtotal,
            0
        );

        const shipping = SHIPPING;
        const total = subtotal + shipping;

        /*
         * Gera o identificador do pedido.
         *
         * Esse MESMO order_nsu será enviado para a InfinitePay
         * e posteriormente utilizado pelo webhook para localizar
         * o pedido no nosso banco.
         */
        const orderNsu = crypto.randomUUID();
        /*
         * Cria o pedido local antes de criar o checkout.
         */
        const { data: order, error: orderError } = await supabase
            .schema("scmold")
            .from("order")
            .insert({
                user_id: user.id,
                order_nsu: orderNsu,

                customer_email: customer.email,
                customer_cpf: customer.cpf ?? null,

                cep: customer.cep,
                address: customer.address,
                number: customer.number,
                district: customer.district,
                city: customer.city,
                complement: customer.complement || null,

                subtotal,
                shipping,
                total,

                payment_status: "PENDING",
                status: "PENDING_PAYMENT",

                created_at: new Date().toISOString(),
                created_by: user.id,
            })
            .select("order_id, order_nsu")
            .single();

        if (orderError || !order) {
            console.error("Order creation error:", orderError);

            return NextResponse.json(
                {
                    success: false,
                    error: "Não foi possível criar o pedido.",
                },
                { status: 500 }
            );
        }

        /*
         * Cria os itens do pedido.
         */
        const orderItemsToInsert = orderItems.map((item) => ({
            order_id: order.order_id,

            plant_id: item.plantId,
            base_id: item.baseId,

            plant_name: item.plantName,
            base_name: item.baseName,

            quantity: item.quantity,

            unit_price: item.unitPrice,
            subtotal: item.subtotal,

            created_at: new Date().toISOString(),
            created_by: user.id,

            status: "A",
        }));

        const { error: orderItemsError } = await supabase
            .schema("scmold")
            .from("order_item")
            .insert(orderItemsToInsert);

        if (orderItemsError) {
            console.error(
                "Order items creation error:",
                orderItemsError
            );

            /*
             * Como o pedido ainda não possui pagamento,
             * podemos removê-lo caso os itens não sejam criados.
             */
            await supabase
                .schema("scmold")
                .from("order")
                .update({
                    status: "E",
                    altered_at: new Date().toISOString(),
                    altered_by: "SYSTEM",
                })
                .eq("order_id", order.order_id);

            return NextResponse.json(
                {
                    success: false,
                    error: "Não foi possível criar os itens do pedido.",
                },
                { status: 500 }
            );
        }

        /*
         * Monta os itens enviados para a InfinitePay.
         *
         * A InfinitePay trabalha com valores em centavos.
         */
        const paymentItems = orderItems.map((item) => ({
            quantity: item.quantity,
            price: Math.round(item.unitPrice * 100),
            description: `${item.plantName} + ${item.baseName}`,
        }));

        /*
         * Adiciona o frete como um item separado.
         */
        if (shipping > 0) {
            paymentItems.push({
                quantity: 1,
                price: Math.round(shipping * 100),
                description: "Taxa de entrega",
            });
        }

        /*
         * Cria o checkout da InfinitePay.
         *
         * O order_nsu é o mesmo registrado no nosso pedido.
         */
        const payment = {
            handle: process.env.INFINITEPAY_HANDLE,

            order_nsu: orderNsu,

            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,

            webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/infinitepay/webhook`,


            items: paymentItems,

            customer: {
                email: customer.email,
            },

            address: {
                cep: customer.cep,
                street: customer.address,
                number: customer.number,
                neighborhood: customer.district,
                city: customer.city,
                complement: customer.complement || undefined,
            },
        };

        const response = await fetch(INFINITEPAY_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payment),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("InfinitePay error:", data);

            /*
             * O checkout não foi criado.
             * Como ainda não existe pagamento, removemos o pedido
             * para não deixar registros órfãos.
             */
            await supabase
                .schema("scmold")
                .from("order")
                .update({
                    status: "E",
                    altered_at: new Date().toISOString(),
                    altered_by: "INFINITEPAY",
                })
                .eq("order_id", order.order_id);

            return NextResponse.json(
                {
                    success: false,
                    error:
                        typeof data?.error === "string"
                            ? data.error
                            : "Não foi possível criar o pagamento.",
                },
                { status: response.status }
            );
        }

        /*
         * Guarda informações retornadas pela InfinitePay,
         * caso estejam disponíveis na resposta inicial.
         */
        if (
            data.invoice_slug ||
            data.slug ||
            data.receipt_url
        ) {
            const invoiceSlug =
                data.invoice_slug ?? data.slug ?? null;

            await supabase
                .schema("scmold")
                .from("order")
                .update({
                    infinitepay_invoice_slug: invoiceSlug,
                    infinitepay_receipt_url:
                        data.receipt_url ?? null,
                    altered_at: new Date().toISOString(),
                    altered_by: "INFINITEPAY",
                })
                .eq("order_id", order.order_id);
        }

        return NextResponse.json({
            success: true,
            order_id: order.order_id,
            order_nsu: order.order_nsu,
            ...data,
        });
    } catch (error) {
        console.error(
            "InfinitePay route error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Erro ao criar pagamento.",
            },
            { status: 500 }
        );
    }
}