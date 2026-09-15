"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Package,
    Truck,
    XCircle,
    Loader2,
    RefreshCw,
    Search,
} from "lucide-react";

type OrderStatus =
    | "PREPARING"
    | "PRODUCTION"
    | "SHIPPED"
    | "DELIVERED"
    | "E";

type OrderItem = {
    order_item_id: string;
    plant_id: string;
    base_id: string;
    plant_name: string;
    base_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

type Order = {
    order_id: string;
    order_nsu: string;
    customer_email: string;
    customer_cpf: string | null;

    cep: string;
    address: string;
    number: string;
    district: string;
    city: string;
    complement: string | null;

    subtotal: number;
    shipping: number;
    total: number;

    payment_status: string;
    statusorder: OrderStatus;

    infinitepay_capture_method: string | null;
    infinitepay_installments: number | null;

    created_at: string;
    paid_at: string | null;

    items: OrderItem[];
};

const STATUS_CONFIG: Record<
    OrderStatus,
    {
        title: string;
        description: string;
        icon: typeof Package;
        color: string;
        bg: string;
        border: string;
    }
> = {
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
};

const STATUS_ORDER: OrderStatus[] = [
    "PREPARING",
    "PRODUCTION",
    "SHIPPED",
    "DELIVERED",
];

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}

function getNextStatuses(statusorder: OrderStatus): OrderStatus[] {
    switch (statusorder) {
        case "PREPARING":
            return ["PRODUCTION", "E"];

        case "PRODUCTION":
            return ["SHIPPED", "E"];

        case "SHIPPED":
            return ["DELIVERED"];

        case "DELIVERED":
            return [];

        case "E":
            return [];

        default:
            return [];
    }
}

export default function AdminOrdersClient() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] =
        useState<"ALL" | OrderStatus>("ALL");

    const [updatingOrder, setUpdatingOrder] =
        useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    async function loadOrders(showRefresh = false) {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const response = await fetch(
                "/api/manage/orders",
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Não foi possível carregar os pedidos."
                );
            }

            setOrders(data.orders ?? []);
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar pedidos."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    async function updateStatus(
        orderId: string,
        statusorder: OrderStatus
    ) {
        try {
            setUpdatingOrder(orderId);
            setError(null);

            const response = await fetch(
                `/api/manage/orders/${orderId}/statusorder`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        statusorder,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Não foi possível atualizar o pedido."
                );
            }

            setOrders((current) =>
                current.map((order) =>
                    order.order_id === orderId
                        ? {
                            ...order,
                            statusorder,
                        }
                        : order
                )
            );
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar pedido."
            );
        } finally {
            setUpdatingOrder(null);
        }
    }

    const filteredOrders = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return orders.filter((order) => {
            const matchesStatus =
                filterStatus === "ALL" ||
                order.statusorder === filterStatus;

            if (!normalizedSearch) {
                return matchesStatus;
            }

            const searchable = [
                order.order_nsu,
                order.customer_email,
                order.customer_cpf,
                order.address,
                order.city,
                ...order.items.flatMap((item) => [
                    item.plant_name,
                    item.base_name,
                ]),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                matchesStatus &&
                searchable.includes(normalizedSearch)
            );
        });
    }, [orders, search, filterStatus]);

    const counters = useMemo(() => {
        return {
            total: orders.length,

            preparing: orders.filter(
                (order) => order.statusorder === "PREPARING"
            ).length,

            production: orders.filter(
                (order) => order.statusorder === "PRODUCTION"
            ).length,

            shipped: orders.filter(
                (order) => order.statusorder === "SHIPPED"
            ).length,

            delivered: orders.filter(
                (order) => order.statusorder === "DELIVERED"
            ).length,

            cancelled: orders.filter(
                (order) => order.statusorder === "E"
            ).length,
        };
    }, [orders]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#080808] text-white">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
                    <div className="flex items-center gap-3 text-white/60">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Carregando pedidos...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#080808] text-white pt-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#FFCD92]/60">
                            Administração
                        </p>

                        <h2 className="text-3xl font-semibold tracking-tight">
                            Pedidos
                        </h2>

                        <p className="mt-2 text-sm text-white/50">
                            Gerencie os pedidos pagos e acompanhe sua
                            produção.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadOrders(true)}
                        disabled={refreshing}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 g-white/3 px-4 text-sm text-white/70 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${refreshing
                                    ? "animate-spin"
                                    : ""
                                }`}
                        />

                        Atualizar
                    </button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* COUNTERS */}
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <SummaryCard
                        label="Total"
                        value={counters.total}
                    />

                    <SummaryCard
                        label="Preparando"
                        value={counters.preparing}
                    />

                    <SummaryCard
                        label="Produção"
                        value={counters.production}
                    />

                    <SummaryCard
                        label="Enviados"
                        value={counters.shipped}
                    />

                    <SummaryCard
                        label="Entregues"
                        value={counters.delivered}
                    />

                    <SummaryCard
                        label="Cancelados"
                        value={counters.cancelled}
                    />
                </div>

                {/* FILTERS */}
                <div className="mb-6 flex flex-col gap-3 lg:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar por pedido, cliente ou produto..."
                            className="h-11 w-full rounded-xl border border-white/10 g-white/3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#FFCD92]/30"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(event) =>
                            setFilterStatus(
                                event.target.value as
                                | "ALL"
                                | OrderStatus
                            )
                        }
                        className="h-11 rounded-xl border border-white/10 bg-[#111] px-4 text-sm text-white outline-none"
                    >
                        <option value="ALL">
                            Todos os status
                        </option>

                        {Object.entries(
                            STATUS_CONFIG
                        ).map(([status, config]) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {config.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ORDERS */}
                {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/2 px-6 py-16 text-center">
                        <Package className="mx-auto mb-4 h-10 w-10 text-white/20" />

                        <h2 className="text-lg font-medium">
                            Nenhum pedido encontrado
                        </h2>

                        <p className="mt-2 text-sm text-white/40">
                            Não existem pedidos que correspondam
                            aos filtros selecionados.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredOrders.map((order) => {

                            const config =
                                STATUS_CONFIG[
                                order.statusorder
                                ] ?? STATUS_CONFIG[
                                "PREPARING"
                                ];

                            const Icon = config.icon;

                            const isExpanded =
                                expandedOrder ===
                                order.order_id;

                            const nextStatuses =
                                getNextStatuses(
                                    order.statusorder
                                );

                            return (
                                <div
                                    key={order.order_id}
                                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/2"
                                >
                                    {/* ORDER HEADER */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedOrder(
                                                isExpanded
                                                    ? null
                                                    : order.order_id
                                            )
                                        }
                                        className="w-full px-4 py-4 text-left transition hover:bg-white/2.5 sm:px-5"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex min-w-0 items-center gap-4">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-medium">
                                                            Pedido #
                                                            {order.order_nsu.slice(
                                                                0,
                                                                8
                                                            )}
                                                        </span>

                                                        <span
                                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.bg} ${config.color} ${config.border}`}
                                                        >
                                                            {
                                                                config.title
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                                                        <span>
                                                            {
                                                                order.customer_email
                                                            }
                                                        </span>

                                                        <span>
                                                            {formatDate(
                                                                order.created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-6 lg:justify-end">
                                                <div className="text-left lg:text-right">
                                                    <p className="text-xs text-white/40">
                                                        Total
                                                    </p>

                                                    <p className="mt-1 font-medium">
                                                        {formatCurrency(
                                                            Number(
                                                                order.total
                                                            )
                                                        )}
                                                    </p>
                                                </div>

                                                {isExpanded ? (
                                                    <ChevronUp className="h-5 w-5 text-white/30" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-white/30" />
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {/* DETAILS */}
                                    {isExpanded && (
                                        <div className="border-t border-white/10 px-4 py-5 sm:px-5">
                                            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                                                <div>
                                                    <h3 className="mb-3 text-sm font-medium text-white/80">
                                                        Itens do pedido
                                                    </h3>

                                                    <div className="space-y-2">
                                                        {order.items.map(
                                                            (
                                                                item
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        item.order_item_id
                                                                    }
                                                                    className="rounded-xl border border-white/10 bg-white/2 p-4"
                                                                >
                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div>
                                                                            <p className="text-sm font-medium">
                                                                                {
                                                                                    item.plant_name
                                                                                }{" "}
                                                                                +{" "}
                                                                                {
                                                                                    item.base_name
                                                                                }
                                                                            </p>

                                                                            <p className="mt-1 text-xs text-white/40">
                                                                                Quantidade:{" "}
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </p>
                                                                        </div>

                                                                        <p className="text-sm font-medium">
                                                                            {formatCurrency(
                                                                                Number(
                                                                                    item.subtotal
                                                                                )
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                    {/* ADDRESS */}
                                                    <div className="mt-6">
                                                        <h3 className="mb-3 text-sm font-medium text-white/80">
                                                            Entrega
                                                        </h3>

                                                        <div className="rounded-xl border border-white/10 bg-white/2 p-4 text-sm text-white/60">
                                                            <p>
                                                                {
                                                                    order.address
                                                                }
                                                                ,{" "}
                                                                {
                                                                    order.number
                                                                }
                                                            </p>

                                                            <p className="mt-1">
                                                                {
                                                                    order.district
                                                                }{" "}
                                                                —{" "}
                                                                {
                                                                    order.city
                                                                }
                                                            </p>

                                                            <p className="mt-1">
                                                                CEP:{" "}
                                                                {
                                                                    order.cep
                                                                }
                                                            </p>

                                                            {order.complement && (
                                                                <p className="mt-1">
                                                                    Complemento:{" "}
                                                                    {
                                                                        order.complement
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* SIDE */}
                                                <div className="space-y-4">
                                                    {/* PAYMENT */}
                                                    <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                                                        <p className="mb-3 text-xs uppercase tracking-wider text-white/30">
                                                            Pagamento
                                                        </p>

                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between gap-4">
                                                                <span className="text-white/40">
                                                                    Status
                                                                </span>

                                                                <span className="text-green-400">
                                                                    Aprovado
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between gap-4">
                                                                <span className="text-white/40">
                                                                    Método
                                                                </span>

                                                                <span>
                                                                    {order.infinitepay_capture_method ||
                                                                        "—"}
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between gap-4">
                                                                <span className="text-white/40">
                                                                    Parcelas
                                                                </span>

                                                                <span>
                                                                    {order.infinitepay_installments ??
                                                                        1}
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 border-t border-white/10 pt-3 flex justify-between gap-4">
                                                                <span className="text-white/40">
                                                                    Total
                                                                </span>

                                                                <span className="font-medium">
                                                                    {formatCurrency(
                                                                        Number(
                                                                            order.total
                                                                        )
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* STATUS */}
                                                    <div className="rounded-xl border border-white/10 bg-white/2 p-4">
                                                        <p className="mb-3 text-xs uppercase tracking-wider text-white/30">
                                                            Alterar status
                                                        </p>

                                                        {nextStatuses.length ===
                                                            0 ? (
                                                            <p className="text-sm text-white/40">
                                                                Este pedido
                                                                não possui
                                                                mais
                                                                transições
                                                                disponíveis.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {nextStatuses.map(
                                                                    (
                                                                        nextStatus
                                                                    ) => {
                                                                        const nextConfig =
                                                                            STATUS_CONFIG[
                                                                            nextStatus
                                                                            ];

                                                                        const NextIcon =
                                                                            nextConfig.icon;

                                                                        const isUpdating =
                                                                            updatingOrder ===
                                                                            order.order_id;

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    nextStatus
                                                                                }
                                                                                type="button"
                                                                                disabled={
                                                                                    isUpdating
                                                                                }
                                                                                onClick={() =>
                                                                                    updateStatus(
                                                                                        order.order_id,
                                                                                        nextStatus
                                                                                    )
                                                                                }
                                                                                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${nextConfig.bg} ${nextConfig.border} hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50`}
                                                                            >
                                                                                {isUpdating ? (
                                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                                ) : (
                                                                                    <NextIcon
                                                                                        className={`h-4 w-4 ${nextConfig.color}`}
                                                                                    />
                                                                                )}

                                                                                <div>
                                                                                    <p
                                                                                        className={`text-sm font-medium ${nextConfig.color}`}
                                                                                    >
                                                                                        {
                                                                                            nextConfig.title
                                                                                        }
                                                                                    </p>

                                                                                    <p className="mt-0.5 text-[11px] text-white/35">
                                                                                        {
                                                                                            nextConfig.description
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/2 p-4">
            <div className="flex items-center justify-between">
                <Clock className="h-4 w-4 text-white/20" />
                <span className="text-2xl font-semibold">
                    {value}
                </span>
            </div>

            <p className="mt-2 text-xs text-white/40">
                {label}
            </p>
        </div>
    );
}