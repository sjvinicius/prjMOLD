import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@/utils/supabase/service";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = [
    "PREPARING",
    "PRODUCTION",
    "SHIPPED",
    "DELIVERED",
    "E",
] as const;

type OrderStatus = (typeof VALID_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<
    OrderStatus,
    OrderStatus[]
> = {
    PREPARING: [
        "PRODUCTION",
        "E",
    ],
    PRODUCTION: [
        "SHIPPED",
        "E",
    ],
    SHIPPED: [
        "DELIVERED",
    ],
    DELIVERED: [],
    E: [],
};

export async function POST(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            orderId: string;
        }>;
    }
) {
    try {
        const { orderId } = await params;

        const body = await request.json();

        const newStatus =
            body?.statusorder as OrderStatus;

        /*
         * Valida o status recebido.
         */
        if (!VALID_STATUSES.includes(newStatus)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Status inválido.",
                },
                { status: 400 }
            );
        }

        /*
         * Client normal:
         * usado exclusivamente para identificar
         * e autenticar o usuário da requisição.
         */
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Não autenticado.",
                },
                { status: 401 }
            );
        }

        /*
         * Somente ADMIN e MANAGER podem alterar
         * o status dos pedidos.
         */
        const role =
            user.app_metadata?.role?.toUpperCase();

        if (role !== "ADMIN" && role !== "MANAGER") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Acesso não autorizado.",
                },
                { status: 403 }
            );
        }

        /*
         * Service Role:
         * usado somente no backend para as operações
         * administrativas que precisam ignorar RLS.
         */
        const supabaseAdmin = createServiceClient;

        /*
         * Busca o pedido atual.
         */
        const {
            data: order,
            error: orderError,
        } = await supabaseAdmin
            .schema("scmold")
            .from("order")
            .select(`
                order_id,
                payment_status,
                statusorder
            `)
            .eq("order_id", orderId)
            .eq("status", "A")
            .maybeSingle();

        if (orderError) {
            console.error(
                "Order lookup error:",
                orderError
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Erro ao consultar pedido.",
                },
                { status: 500 }
            );
        }

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Pedido não encontrado.",
                },
                { status: 404 }
            );
        }

        /*
         * Somente pedidos pagos podem avançar
         * no fluxo de produção.
         */
        if (order.payment_status !== "PAID") {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Somente pedidos pagos podem ser alterados.",
                },
                { status: 400 }
            );
        }

        const currentStatus =
            order.statusorder as OrderStatus;

        const allowedStatuses =
            ALLOWED_TRANSITIONS[currentStatus] ?? [];

        /*
         * Impede saltos de status.
         */
        if (!allowedStatuses.includes(newStatus)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        `Transição inválida: ${currentStatus} → ${newStatus}.`,
                },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();

        /*
         * Atualiza o pedido somente se ele ainda
         * estiver no status que acabamos de consultar.
         *
         * Isso evita que dois gestores alterem
         * o mesmo pedido simultaneamente.
         */
        const {
            data: updatedOrder,
            error: updateError,
        } = await supabaseAdmin
            .schema("scmold")
            .from("order")
            .update({
                statusorder: newStatus,
                altered_at: now,
                altered_by: user.id,
            })
            .eq("order_id", orderId)
            .eq("payment_status", "PAID")
            .eq("statusorder", currentStatus)
            .eq("status", "A")
            .select("order_id, statusorder")
            .maybeSingle();

        if (updateError) {
            console.error(
                "Order update error:",
                updateError
            );

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Não foi possível atualizar o pedido.",
                },
                { status: 500 }
            );
        }

        /*
         * Nenhuma linha foi atualizada.
         *
         * Provavelmente outro gestor alterou o pedido
         * entre o SELECT e o UPDATE.
         */
        if (!updatedOrder) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "O pedido foi alterado por outro usuário. Atualize a página.",
                },
                { status: 409 }
            );
        }

        /*
         * Registra o histórico da alteração.
         *
         * Aqui usamos o service_role para que a operação
         * não seja bloqueada pela RLS da tabela.
         */
        const {
            error: historyError,
        } = await supabaseAdmin
            .schema("scmold")
            .from("order_status_history")
            .insert({
                order_id: orderId,
                old_status: currentStatus,
                new_status: newStatus,
                created_at: now,
                created_by: user.id,
                altered_at: now,
                altered_by: user.id,
                status: "A",
            });

        if (historyError) {
            console.error(
                "Status history error:",
                historyError
            );

            /*
             * IMPORTANTE:
             *
             * O pedido já foi atualizado neste ponto.
             * Portanto, se o histórico falhar, existe
             * uma inconsistência entre order e
             * order_status_history.
             *
             * O ideal posteriormente é transformar
             * UPDATE + INSERT em uma RPC transacional.
             */
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "O pedido foi atualizado, mas não foi possível registrar o histórico.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
        });

    } catch (error) {
        console.error(
            "Manage order status error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Erro interno.",
            },
            { status: 500 }
        );
    }
}
