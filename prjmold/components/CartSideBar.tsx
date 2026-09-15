"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";

interface CartSidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function CartSidebar({
    open,
    onClose,
}: CartSidebarProps) {

    const router = useRouter();

    const {
        items,
        total,
        updateQuantity,
        removeItem,
    } = useCart();

    // if (!open) {
    //     return null;
    // }

    const handleCheckout = () => {
        onClose();
        router.push("/checkout");
    };

    return (
        <>

            {/* Overlay */}

            <div
                className={`
                    fixed inset-0 z-60
                    bg-black/60 backdrop-blur-sm
                    transition-opacity duration-300
                    ${open ? "opacity-100" : "pointer-events-none opacity-0"}
                `}
                onClick={onClose}
            />


            {/* Sidebar */}

            <aside
                aria-hidden={!open}
                className={`
                    fixed right-0 top-0 z-70
                    flex h-screen w-full max-w-md flex-col
                    border-l border-white/10
                    bg-[#111] shadow-2xl

                    transform
                    transition-transform
                    duration-300
                    ease-out

                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >

                {/* Header */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        px-6
                        py-5
                    "
                >

                    <div>
                        <span
                            className="
                                text-[10px]
                                uppercase
                                tracking-[4px]
                                text-[#FFCD92]
                            "
                        >
                            Estúdio Mol·D
                        </span>

                        <h2
                            className="
                                mt-1
                                text-xl
                                font-medium
                                text-white
                            "
                        >
                            Seu carrinho
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-white/50
                            transition
                            hover:text-white
                        "
                        aria-label="Fechar carrinho"
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* Produtos */}

                <div className="flex-1 overflow-y-auto px-6 py-6">

                    {items.length === 0 ? (

                        <div
                            className="
                                flex
                                h-full
                                flex-col
                                items-center
                                justify-center
                                text-center
                            "
                        >

                            <ShoppingBag
                                size={42}
                                strokeWidth={1}
                                className="mb-5 text-white/30"
                            />

                            <h3 className="text-lg text-white">
                                Seu carrinho está vazio
                            </h3>

                            <p className="mt-2 text-sm text-white/40">
                                Adicione uma composição para começar.
                            </p>

                        </div>

                    ) : (

                        <div className="flex flex-col gap-5">

                            {items.map((item) => {

                                const itemTotal =
                                    item.plant.price +
                                    item.base.price;

                                return (
                                    <div
                                        key={item.id}
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            p-4
                                        "
                                    >

                                        <div className="flex gap-4">

                                            {/* Planta */}

                                            <div className="flex h-20 w-20 shrink-0 gap-1 overflow-hidden rounded-xl">
                                                <div className="relative h-full w-1/2 bg-white/10">
                                                    <Image
                                                        src={item.plant.image}
                                                        alt={item.plant.name}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="relative h-full w-1/2 bg-white/10">
                                                    <Image
                                                        src={item.base.image}
                                                        alt={item.base.name}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            {/* Informações */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex justify-between gap-3">

                                                    <div>

                                                        <h3 className="text-sm font-medium text-white">
                                                            Bio Luz {item.plant.name} | {item.base.name}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-white/40">
                                                            {new Intl.NumberFormat("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }).format(item.plant.price)} | {new Intl.NumberFormat("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }).format(item.base.price)}
                                                        </p>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        className="
                                                            text-white/30
                                                            transition
                                                            hover:text-red-400
                                                        "
                                                        aria-label="Remover item"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>

                                                </div>


                                                {/* Preço */}

                                                <div className="mt-3 flex items-center justify-between">

                                                    <span className="text-sm text-[#FFCD92]">
                                                        {new Intl.NumberFormat(
                                                            "pt-BR",
                                                            {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }
                                                        ).format(itemTotal)}
                                                    </span>


                                                    {/* Quantidade */}

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

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );

                            })}

                        </div>

                    )}

                </div>


                {/* Footer */}

                {items.length > 0 && (
                    <div
                        className="
                            border-t
                            border-white/10
                            bg-black/20
                            px-6
                            py-6
                        "
                    >

                        <div className="mb-5 flex items-center justify-between">

                            <span className="text-sm text-white/50">
                                Subtotal
                            </span>

                            <span className="text-xl font-medium text-white">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(total)}
                            </span>

                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full"
                        >
                            Finalizar compra
                        </Button>

                    </div>
                )}

            </aside>

        </>
    );
}