"use client";

import Link from "next/link";
import { CartItem, useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import { Minus, Plus, Trash2 } from "lucide-react";

type CheckoutSummaryProps = {
    items: CartItem[];
    loading: boolean;
    error: string | null;
};

export default function CheckoutSummary({
    items,
    loading,
    error,
}: CheckoutSummaryProps) {
    const {
        updateQuantity,
        removeItem,
    } = useCart();

    const shipping = items.length > 0 ? 25 : 0;

    const subtotal = items.reduce(
        (sum, item) =>
            sum +
            (item.plant.price + item.base.price) *
            item.quantity,
        0
    );

    const total = subtotal + shipping;

    const formatPrice = (price: number) =>
        price.toFixed(2).replace(".", ",");

    return (
        <div className="min-w-0">

            <h2 className="mt-2 mb-6 text-3xl sm:mb-8 sm:text-4xl">
                Seu Pedido
            </h2>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                    <p className="text-sm text-white/60">
                        Seu carrinho está vazio.
                    </p>

                    <Link
                        href="/products"
                        className="mt-4 text-sm text-[#FFCD92] transition-opacity hover:opacity-70"
                    >
                        Voltar para produtos
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {items.map((item) => {
                        const itemTotal =
                            (item.plant.price +
                                item.base.price) *
                            item.quantity;

                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-white/10 bg-white/5 p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-medium text-white">
                                            {item.plant.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-white/50">
                                            Base: {item.base.name}
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-sm text-[#FFCD92]">
                                        R${" "}
                                        {formatPrice(itemTotal)}
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={
                                                item.quantity <= 1
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-white/70 transition hover:border-[#FFCD92]/40 hover:text-[#FFCD92] disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <Minus size={14} />
                                        </button>

                                        <span className="w-6 text-center text-sm text-white">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-white/70 transition hover:border-[#FFCD92]/40 hover:text-[#FFCD92]"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeItem(item.id)
                                        }
                                        className="text-white/40 transition hover:text-red-500"
                                        aria-label="Remover item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="border-t border-white/10 pt-5">
                        <div className="flex items-center justify-between text-sm text-white/60">
                            <span>Subtotal</span>

                            <span>
                                R$ {formatPrice(subtotal)}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                            <span>Frete</span>

                            <span>
                                R$ {formatPrice(shipping)}
                            </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                            <span className="text-base text-white">
                                Total
                            </span>

                            <span className="text-xl font-medium text-[#FFCD92]">
                                R$ {formatPrice(total)}
                            </span>
                        </div>
                    </div>
                    
                    <span className="text-xs text-red-500">
                        {error}
                    </span>

                    <Button
                        type="submit"
                        form="checkout-form"
                        disabled={loading || items.length === 0}
                        className="mt-4 w-full sm:mt-3"
                    >
                        {loading ? "Processando..." : "Finalizar e Pagar"}
                    </Button>
                </div>
            )}
        </div>
    );

}
