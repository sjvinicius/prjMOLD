import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const INFINITEPAY_PAYMENT_CHECK =
    "https://api.checkout.infinitepay.io/payment_check";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            order_nsu,
            invoice_slug,
            transaction_nsu,
            paid_amount,
            installments,
            capture_method,
            receipt_url,
        } = body;

        /*
         * O order_nsu é o vínculo entre a InfinitePay
         * e o pedido criado no nosso banco.
         */
        if (
            typeof order_nsu !== "string" ||
            !order_nsu
        ) {
            console.error(
                "InfinitePay webhook: order_nsu não informado."
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "order_nsu não informado.",
                },
                { status: 400 }
            );
        }

        /*
         * Esses dados são necessários para consultar
         * o status real da transação na InfinitePay.
         */
        if (
            typeof transaction_nsu !== "string" ||
            !transaction_nsu ||
            typeof invoice_slug !== "string" ||
            !invoice_slug
        ) {
            console.error(
                "InfinitePay webhook: dados da transação incompletos."
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Dados da transação incompletos.",
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        /*
         * Localiza o pedido pelo order_nsu.
         */
        const { data: order, error: orderError } =
            await supabase
                .schema("scmold")
                .from("order")
                .select(
                    `
                        order_id,
                        order_nsu,
                        total,
                        payment_status,
                        status
                    `
                )
                .eq("order_nsu", order_nsu)
                .single();

        if (orderError || !order) {
            console.error(
                "Pedido não encontrado:",
                orderError
            );

            /*
             * Retornamos 400 para a InfinitePay tentar
             * novamente posteriormente.
             */
            return NextResponse.json(
                {
                    success: false,
                    message: "Pedido não encontrado.",
                },
                { status: 400 }
            );
        }

        /*
         * Se o pedido já foi confirmado, não precisamos
         * processar o webhook novamente.
         *
         * Isso também protege contra webhooks duplicados.
         */
        if (order.payment_status === "PAID") {
            return NextResponse.json({
                success: true,
                message: "Pagamento já processado.",
            });
        }

        /*
         * Consulta diretamente a InfinitePay para confirmar
         * o estado real da transação.
         */
        const paymentCheckResponse = await fetch(
            INFINITEPAY_PAYMENT_CHECK,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    handle:
                        process.env.INFINITEPAY_HANDLE,
                    order_nsu,
                    transaction_nsu,
                    slug: invoice_slug,
                }),
            }
        );

        const paymentCheck =
            await paymentCheckResponse.json();

        /*
         * Se a própria InfinitePay não confirmou
         * o pagamento, não alteramos o pedido.
         */
        if (
            !paymentCheckResponse.ok ||
            paymentCheck.success !== true ||
            paymentCheck.paid !== true
        ) {
            console.error(
                "Pagamento não confirmado pela InfinitePay:",
                paymentCheck
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Pagamento não confirmado pela InfinitePay.",
                },
                { status: 400 }
            );
        }

        /*
         * O valor retornado pelo payment_check é em centavos.
         *
         * Exemplo:
         *
         * 30460 = R$ 304,60
         */
        const paidAmountInCents =
            Number(paymentCheck.paid_amount);

        if (
            !Number.isFinite(paidAmountInCents) ||
            paidAmountInCents <= 0
        ) {
            console.error(
                "Valor pago inválido:",
                paymentCheck.paid_amount
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Valor pago inválido.",
                },
                { status: 400 }
            );
        }

        /*
         * Nosso total também é convertido para centavos.
         *
         * Usamos Math.round para evitar problemas de
         * precisão de ponto flutuante.
         */
        const orderTotalInCents = Math.round(
            Number(order.total) * 100
        );

        /*
         * Nunca aprovamos um pedido se o valor pago
         * for menor que o total esperado.
         */
        if (paidAmountInCents < orderTotalInCents) {
            console.error(
                "Valor pago inferior ao total do pedido:",
                {
                    orderId: order.order_id,
                    orderTotal: orderTotalInCents,
                    paidAmount: paidAmountInCents,
                }
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "O valor pago é inferior ao total do pedido.",
                },
                { status: 400 }
            );
        }

        /*
         * Neste ponto temos três confirmações:
         *
         * 1. order_nsu corresponde a um pedido nosso;
         * 2. InfinitePay confirmou paid = true;
         * 3. paid_amount >= order.total.
         *
         * Agora podemos confirmar o pedido.
         */
        const now = new Date().toISOString();

        const { error: updateError } =
            await supabase
                .schema("scmold")
                .from("order")
                .update({
                    payment_status: "PAID",

                    status: "PROCESSING",

                    infinitepay_invoice_slug:
                        invoice_slug,

                    infinitepay_transaction_nsu:
                        transaction_nsu,

                    infinitepay_receipt_url:
                        receipt_url ?? null,

                    infinitepay_capture_method:
                        capture_method ??
                        paymentCheck.capture_method ??
                        null,

                    infinitepay_installments:
                        installments ??
                        paymentCheck.installments ??
                        null,

                    paid_amount:
                        paidAmountInCents / 100,

                    paid_at: now,

                    altered_at: now,
                    altered_by: "INFINITEPAY_WEBHOOK",
                })
                .eq("order_id", order.order_id)
                .eq("payment_status", "PENDING");

        if (updateError) {
            console.error(
                "Erro ao atualizar pedido:",
                updateError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Não foi possível atualizar o pedido.",
                },
                { status: 400 }
            );
        }

        /*
         * A InfinitePay recomenda responder rapidamente
         * ao webhook.
         */
        return NextResponse.json({
            success: true,
            message: null,
        });
    } catch (error) {
        console.error(
            "InfinitePay webhook error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Erro ao processar webhook.",
            },
            { status: 400 }
        );
    }
}