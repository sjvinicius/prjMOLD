"use client";

import Link from "next/link";
import { CartItem, useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import { Trash2, Minus, Plus } from "lucide-react";

type CheckoutSummaryProps = {
    items: CartItem[];
};

export default function CheckoutSummary({
    items,
}: CheckoutSummaryProps) {
    const { updateQuantity, removeItem } = useCart();

    const shipping = items.length > 0 ? 25 : 0;

    const subtotal = items.reduce(
        (sum, item) =>
            sum +
            (item.plant.price + item.base.price) * item.quantity,
        0
    );

    const total = subtotal + shipping;

    const formatPrice = (price: number) =>
        price.toFixed(2).replace(".", ",");

    return (
        <aside className="flex flex-col gap-6 sm:gap-8">
            <div className="rounded-2xl border border-[#FFCD921A] bg-white/3 p-5 backdrop-blur-xl sm:rounded-[20px] sm:p-8">

                <small className="mb-5 block text-[10px] uppercase tracking-[2px] text-[#FFCD92]/70 sm:mb-6">
                    Seu Setup
                </small>

                {items.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-sm text-white/60">
                            Seu carrinho está vazio.
                        </p>

                        <Link
                            href="/products"
                            className="mt-4 inline-block text-xs uppercase tracking-[2px] text-[#FFCD92] transition hover:opacity-70"
                        >
                            Escolher produtos
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-3">
                            {items.map((item) => {
                                const itemTotal =
                                    (item.plant.price + item.base.price) *
                                    item.quantity;

                                return (
                                    <div
                                        key={item.id}
                                        className="border-b border-white/10 pb-6 last:border-0 last:pb-0"
                                    >
                                        <div className="flex flex-col gap-4">
                                            {/* Produto */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm text-white/80">
                                                        Módulo Bio Luz{" "}
                                                        <strong className="font-medium text-[#FFCD92]">
                                                            {item.plant.name}
                                                        </strong>
                                                    </p>

                                                    <p className="mt-1 text-sm text-white/60">
                                                        Base{" "}
                                                        <strong className="font-medium text-[#FFCD92]">
                                                            {item.base.type}
                                                        </strong>
                                                    </p>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <span className="shrink-0 text-sm text-white">
                                                            R$ {formatPrice(item.plant.price)}
                                                        </span>
                                                        <br />
                                                        <span className="shrink-0 text-sm text-white">
                                                            R$ {formatPrice(item.base.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm text-white/80">
                                                        Total item
                                                    </p>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <span className="text-sm text-[#FFCD92]">
                                                            Total Item R$ {formatPrice(itemTotal)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Controles */}
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                        rounded-lg
                                                        border
                                                        border-white/10
                                                        px-2
                                                        py-1
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="text-white/50 hover:text-white p-2"
                                                    >
                                                        <Minus size={13} />
                                                    </button>

                                                    <span className="min-w-4 text-center text-xs text-white">
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
                                                        className="text-white/50 hover:text-white p-2"
                                                    >
                                                        <Plus size={13} />
                                                    </button>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-[1.5px]
                                                        text-white/40
                                                        transition
                                                        hover:text-red-400
                                                    "
                                                >

                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Subtotal */}
                        <div className="mt-6 flex items-center justify-between border-t border-[#FFCD9233] pt-6 text-sm">
                            <span className="text-white/60">
                                Subtotal
                            </span>

                            <span>
                                R$ {formatPrice(subtotal)}
                            </span>
                        </div>

                        {/* Frete */}
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-white/60">
                                Frete
                            </span>

                            <span>
                                R$ {formatPrice(shipping)}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="mt-6 flex items-center justify-between border-t border-[#FFCD9233] pt-6">
                            <span className="text-lg">
                                Total
                            </span>

                            <h3 className="text-2xl font-semibold text-[#FFCD92] sm:text-3xl">
                                R$ {formatPrice(total)}
                            </h3>
                        </div>

                        <Button className="mt-4 w-full sm:mt-3">
                            Finalizar e Pagar
                        </Button>

                        <p className="mt-4 text-center text-[10px] text-white/50">
                            Ambiente seguro criptografado pela Mol·D
                        </p>
                    </>
                )}
            </div>

            <Link
                href="/products"
                className="text-center text-xs uppercase tracking-[2px] text-white/50 transition hover:text-[#FFCD92]"
            >
                ← Alterar Combinação de Módulo e Base
            </Link>
        </aside>
    );
}