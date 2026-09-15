import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";

type SuccessPageProps = {
    searchParams: Promise<{
        order_nsu?: string;
    }>;
};

export default async function SuccessPage({
    searchParams,
}: SuccessPageProps) {
    const params = await searchParams;

    const orderNsu = params.order_nsu;

    if (!orderNsu) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 mt-15">
                <div
                    className="absolute inset-0 scale-110 bg-cover bg-center blur-lg"
                    style={{
                        backgroundImage:
                            "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.95)), url('/fundo_hero.jpg')",
                    }}
                />

                <section className="relative z-10 w-full max-w-xl rounded-3xl border border-[#FFCD920D] bg-[rgba(10,10,10,.5)] p-8 text-center backdrop-blur-xl sm:p-12">
                    <h3 className="text-2xl font-semibold text-white">
                        Pedido não encontrado
                    </h3>

                    <p className="mt-3 text-sm text-white/60">
                        Não foi possível identificar o pedido.
                    </p>

                    <Link
                        href="/products"
                        className="mt-8 inline-flex rounded-xl bg-[#FFCD92] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                        Voltar para produtos
                    </Link>
                </section>
            </main>
        );
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: order, error: orderError } =
        await supabase
            .schema("scmold")
            .from("order")
            .select(
                `
                    order_id,
                    order_nsu,
                    customer_email,
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
                    status,
                    infinitepay_receipt_url,
                    paid_amount,
                    paid_at
                `
            )
            .eq("order_nsu", orderNsu)
            .eq("user_id", user.id)
            .single();

    if (orderError || !order) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 mt-15">
                <div
                    className="absolute inset-0 scale-110 bg-cover bg-center blur-lg"
                    style={{
                        backgroundImage:
                            "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.95)), url('/fundo_hero.jpg')",
                    }}
                />

                <section className="relative z-10 w-full max-w-xl rounded-3xl border border-[#FFCD920D] bg-[rgba(10,10,10,.5)] p-8 text-center backdrop-blur-xl sm:p-12">
                    <h3 className="text-2xl font-semibold text-white">
                        Pedido não encontrado
                    </h3>

                    <p className="mt-3 text-sm text-white/60">
                        Não encontramos um pedido associado a este
                        pagamento.
                    </p>

                    <Link
                        href="/products"
                        className="mt-8 inline-flex rounded-xl bg-[#FFCD92] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                        Voltar para produtos
                    </Link>
                </section>
            </main>
        );
    }

    const { data: orderItems } = await supabase
        .schema("scmold")
        .from("order_item")
        .select(
            `
                order_item_id,
                plant_name,
                base_name,
                quantity,
                unit_price,
                subtotal
            `
        )
        .eq("order_id", order.order_id)
        .order("created_at", {
            ascending: true,
        });

    const isPaid = order.payment_status === "PAID";

    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8 mt-15">
            <div
                className="fixed inset-0 scale-110 bg-cover bg-center blur-lg"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.95)), url('/fundo_hero.jpg')",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-4xl">
                <section className="rounded-3xl border border-[#FFCD920D] bg-[rgba(10,10,10,.5)] p-6 backdrop-blur-xl sm:p-10 lg:p-12">
                    <a
                        className="group inline-flex items-center gap-1 text-xs font-medium text-[#FFCD92] transition hover:opacity-80"
                        href="/orders"
                    >
                        <ArrowLeft
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                        Ver meus pedidos
                    </a>{/* Status */}

                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFCD92]/10">
                            <span className="text-3xl">
                                {isPaid ? "✓" : "!"}
                            </span>
                        </div>

                        <h2 className="mt-5 text-3xl font-semibold text-white">
                            {isPaid
                                ? "Obrigado pela sua compra!"
                                : "Pedido recebido!"}
                        </h2>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/60">
                            {isPaid
                                ? "Seu pagamento foi aprovado e seu pedido já está em processamento."
                                : "Recebemos seu pedido e estamos aguardando a confirmação do pagamento."}
                        </p>
                    </div>

                    {/* Pedido */}

                    <div className="mt-10 border-t border-white/10 pt-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-white/40">
                                    Número do pedido
                                </p>

                                <p className="mt-1 break-all font-mono text-sm text-white">
                                    {order.order_nsu}
                                </p>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-xs uppercase tracking-wider text-white/40">
                                    Status
                                </p>

                                <p
                                    className={`mt-1 text-sm font-medium ${isPaid
                                        ? "text-[#FFCD92]"
                                        : "text-white"
                                        }`}
                                >
                                    {isPaid
                                        ? "Pagamento aprovado"
                                        : "Aguardando pagamento"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Itens */}

                    <div className="mt-8">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                            Seu pedido
                        </h2>

                        <div className="mt-4 divide-y divide-white/10">
                            {orderItems?.map((item) => (
                                <div
                                    key={item.order_item_id}
                                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {item.plant_name}
                                        </p>

                                        <p className="mt-1 text-xs text-white/50">
                                            Base: {item.base_name}
                                        </p>

                                        <p className="mt-1 text-xs text-white/40">
                                            Quantidade:{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <div className="text-sm text-white sm:text-right">
                                        R${" "}
                                        {Number(
                                            item.subtotal
                                        ).toFixed(2).replace(".", ",")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Valores */}

                    <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                        <div className="flex justify-between text-sm text-white/60">
                            <span>Subtotal</span>

                            <span>
                                R${" "}
                                {Number(order.subtotal)
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm text-white/60">
                            <span>Entrega</span>

                            <span>
                                R${" "}
                                {Number(order.shipping)
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </span>
                        </div>

                        <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-semibold text-white">
                            <span>Total</span>

                            <span>
                                R${" "}
                                {Number(order.total)
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </span>
                        </div>
                    </div>

                    {/* Entrega */}

                    <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h2 className="text-sm font-semibold text-white">
                            Endereço de entrega
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-white/60">
                            {order.address}, {order.number}
                            <br />

                            {order.district} — {order.city}
                            <br />

                            CEP: {order.cep}

                            {order.complement && (
                                <>
                                    <br />
                                    Complemento:{" "}
                                    {order.complement}
                                </>
                            )}
                        </p>
                    </div>

                    {/* E-mail */}

                    <div className="mt-5 text-center text-xs text-white/40">
                        As informações do pedido foram associadas ao
                        e-mail{" "}
                        <span className="text-white/60">
                            {order.customer_email}
                        </span>
                        .
                    </div>

                    {/* Comprovante */}

                    {isPaid &&
                        order.infinitepay_receipt_url && (
                            <div className="mt-6 text-center">
                                <a
                                    href={
                                        order.infinitepay_receipt_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#FFCD92] underline underline-offset-4 hover:opacity-80"
                                >
                                    Ver comprovante de pagamento
                                </a>
                            </div>
                        )}

                    {/* Voltar */}

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/products"
                            className="inline-flex rounded-xl bg-[#FFCD92] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                            Continuar comprando
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}