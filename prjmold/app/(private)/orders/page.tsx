import Link from "next/link";
import { redirect } from "next/navigation";
import {
    Check,
    ChevronRight,
    Clock,
    Package,
    ShoppingBag,
    Truck,
    XCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";

const STATUS_CONFIG = {
    PENDING_PAYMENT: {
        title: "Aguardando pagamento",
        description: "Aguardando confirmação do pagamento.",
        icon: Clock,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/10",
    },

    PAYMENT_APPROVED: {
        title: "Pagamento aprovado",
        description: "Seu pedido será preparado em breve.",
        icon: Check,
        color: "text-[#FFCD92]",
        bg: "bg-[#FFCD92]/10",
        border: "border-[#FFCD92]/10",
    },

    PREPARING: {
        title: "Em preparação",
        description: "Estamos preparando seu pedido.",
        icon: Package,
        color: "text-[#FFCD92]",
        bg: "bg-[#FFCD92]/10",
        border: "border-[#FFCD92]/10",
    },

    PRODUCTION: {
        title: "Em produção",
        description: "Seu pedido está sendo produzido.",
        icon: Package,
        color: "text-[#FFCD92]",
        bg: "bg-[#FFCD92]/10",
        border: "border-[#FFCD92]/10",
    },

    SHIPPED: {
        title: "Pedido enviado",
        description: "Seu pedido está a caminho.",
        icon: Truck,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/10",
    },

    DELIVERED: {
        title: "Pedido entregue",
        description: "Seu pedido foi entregue.",
        icon: Check,
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/10",
    },

    E: {
        title: "Pedido cancelado",
        description: "Este pedido não foi concluído.",
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/10",
    },
} as const;

function formatCurrency(value: number | string) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default async function OrdersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    const { data: orders, error } = await supabase
        .schema("scmold")
        .from("order")
        .select(`
            order_id,
            order_nsu,
            subtotal,
            shipping,
            total,
            payment_status,
            statusorder,
            created_at,
            order_item (
                order_item_id,
                quantity
            )
        `)
        .eq("user_id", user.id)
        .eq("status", "A")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error("Orders error:", error);
    }

    const orderList = orders ?? [];

    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {/* Background */}
            <div
                className="fixed inset-0 scale-110 bg-cover bg-center blur-lg"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0,0,0,.82), rgba(0,0,0,.96)), url('/fundo_hero.jpg')",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-4xl mt-10">
                {/* Header */}
                <header className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFCD92]/10 text-[#FFCD92]">
                            <ShoppingBag size={21} />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                Minha conta
                            </p>

                            <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                                Meus pedidos
                            </h2>
                        </div>
                    </div>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/50">
                        Acompanhe suas compras, consulte os detalhes dos
                        pedidos e veja o andamento de cada pedido.
                    </p>
                </header>

                {/* Empty state */}
                {orderList.length === 0 ? (
                    <section className="rounded-3xl border border-white/10 bg-[rgba(10,10,10,.55)] p-8 text-center backdrop-blur-xl sm:p-12">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFCD92]/10 text-[#FFCD92]">
                            <ShoppingBag size={27} />
                        </div>

                        <h2 className="mt-6 text-xl font-semibold text-white">
                            Você ainda não fez nenhum pedido
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
                            Quando você realizar uma compra, seus pedidos
                            aparecerão aqui para acompanhamento.
                        </p>

                        <Link
                            href="/products"
                            className="mt-7 inline-flex rounded-xl bg-[#FFCD92] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                            Ver produtos
                        </Link>
                    </section>
                ) : (
                    <>
                        {/* Count */}
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs uppercase tracking-wider text-white/35">
                                {orderList.length === 1
                                    ? "1 pedido"
                                    : `${orderList.length} pedidos`}
                            </p>

                            <Link
                                href="/products"
                                className="text-xs font-medium text-[#FFCD92] transition hover:opacity-80"
                            >
                                Continuar comprando
                            </Link>
                        </div>

                        {/* Orders */}
                        <div className="space-y-3">
                            {orderList.map((order) => {
                                const config =
                                    STATUS_CONFIG[
                                    order.statusorder as keyof typeof STATUS_CONFIG
                                    ] ?? STATUS_CONFIG.PENDING_PAYMENT;

                                const Icon = config.icon;

                                const itemCount =
                                    order.order_item?.reduce(
                                        (total, item) =>
                                            total + Number(item.quantity),
                                        0
                                    ) ?? 0;

                                return (
                                    <Link
                                        key={order.order_id}
                                        href={`/checkout/success?order_nsu=${order.order_nsu}`}
                                        className="group block rounded-3xl border border-white/10 bg-[rgba(10,10,10,.55)] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#FFCD92]/20 hover:bg-[rgba(15,15,15,.7)] sm:p-6"
                                    >
                                        {/* Top */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                                    Pedido
                                                </p>

                                                <h2 className="mt-1 truncate font-mono text-sm font-medium text-white">
                                                    #{order.order_nsu}
                                                </h2>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                                    Total
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#FFCD92]">
                                                    {formatCurrency(
                                                        order.total
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="my-5 h-px bg-white/10" />

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.bg} ${config.color}`}
                                            >
                                                <Icon size={20} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    {config.title}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-white/45">
                                                    {config.description}
                                                </p>
                                            </div>

                                            <ChevronRight
                                                size={19}
                                                className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-[#FFCD92]"
                                            />
                                        </div>

                                        {/* Bottom information */}
                                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/35">
                                            <span>
                                                {formatDate(order.created_at)}
                                            </span>

                                            <span className="h-1 w-1 rounded-full bg-white/20" />

                                            <span>
                                                {itemCount === 1
                                                    ? "1 item"
                                                    : `${itemCount} itens`}
                                            </span>

                                            {order.payment_status === "PAID" && (
                                                <>
                                                    <span className="h-1 w-1 rounded-full bg-white/20" />

                                                    <span className="text-green-400/70">
                                                        Pagamento confirmado
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
