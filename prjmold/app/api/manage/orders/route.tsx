import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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

        const role = user.app_metadata?.role?.toUpperCase();

        if (role !== "ADMIN" && role !== "MANAGER") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Acesso não autorizado.",
                },
                { status: 403 }
            );
        }

        const { data: orders, error: ordersError } =
            await supabase
                .schema("scmold")
                .from("order")
                .select(`
                    order_id,
                    order_nsu,
                    customer_email,
                    customer_cpf,

                    cep,
                    address,
                    number,
                    district,
                    city,
                    complement,

                    subtotal,
                    shipping,
                    total,

                    payment_status,
                    statusorder,

                    infinitepay_capture_method,
                    infinitepay_installments,

                    created_at,
                    paid_at,

                    order_item (
                        order_item_id,
                        plant_id,
                        base_id,
                        plant_name,
                        base_name,
                        quantity,
                        unit_price,
                        subtotal
                    )
                `)
                .eq("payment_status", "PAID")
                .order("created_at", {
                    ascending: false,
                });

        if (ordersError) {
            console.error(
                "Admin orders error:",
                ordersError
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Não foi possível carregar os pedidos.",
                },
                { status: 500 }
            );
        }

        const formattedOrders = (orders ?? []).map(
            (order: any) => ({
                ...order,
                items: order.order_item ?? [],
                order_item: undefined,
            })
        );

        return NextResponse.json({
            success: true,
            orders: formattedOrders,
        });
    } catch (error) {
        console.error(
            "Admin orders route error:",
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