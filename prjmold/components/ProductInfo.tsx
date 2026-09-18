"use client"

import { Product } from "@/types/product";
import Link from "next/link";
import { Button } from "./ui/Button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductInfoProps {
    plant: Product;
    base: Product;
}

export default function ProductInfo({
    plant,
    base,
}: ProductInfoProps) {

    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    const total = plant.price + base.price;

    const { addItem } = useCart();

    function handleAddToCart() {
        if (isAdding) return;

        addItem(plant, base);

        setIsAdding(true);

        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    }

    function handleBuyNow() {

        addItem(plant, base);

        router.push("/checkout");
    }

    return (
        <div className="flex flex-col">

            <span className="mb-2 text-[10px] uppercase tracking-[5px] text-[#FFCD92]">
                Coleção Bio Luz
            </span>

            <div className="mb-10 text-5xl font-semibold leading-none text-white">
                <p>Bio Luz</p>
                <h2 className="text-[#FFCD92]">{plant.name}</h2>
            </div>

            {/* Planta */}

            <section className="mb-8">

                <span className="mb-5 inline-block rounded bg-[#FFCD92]/10 px-3 py-1 text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                    Detalhes da Planta
                </span>

                <div className="grid grid-cols-2 gap-6">
                    {
                        plant.details?.map((detail, index) => {
                            return (
                                <div key={index}>
                                    <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                                        {detail.label}
                                    </small>

                                    <p className="text-sm text-white">
                                        {detail.description}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>

            </section>

            {/* Base */}

            <section>

                <span className="mb-5 inline-block rounded bg-[#FFCD92]/10 px-3 py-1 text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                    Detalhes da Base
                </span>

                <div className="grid grid-cols-2 gap-6">

                    {
                        base.details?.map((detail, index) => {
                            return (
                                <div key={index}>
                                    <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                                        {detail.label}
                                    </small>

                                    <p className="text-sm text-white">
                                        {detail.description}
                                    </p>
                                </div>
                            )
                        })
                    }

                </div>

            </section>

            <div className="flex w-full justify-center flex-col gap-3 my-5" style={{ justifyContent: "end !important", height: "-webkit-fill-available" }}>
                <div className="relative">
                    <AnimatePresence>
                        {isAdding && (
                            <>
                                {/* Luz principal */}
                                <motion.div
                                    initial={{
                                        x: 0,
                                        y: 0,
                                        scale: 0.3,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: 35,
                                        y: -80,
                                        scale: [0.3, 1, 0.7],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 0.75,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-1/2
                                        top-1/2
                                        z-20
                                        h-3
                                        w-3
                                        -translate-x-1/2
                                        -translate-y-1/2
                                        rounded-full
                                        bg-[#FFCD92]
                                        shadow-[0_0_8px_#FFCD92,0_0_20px_#FFCD92,0_0_40px_rgba(255,205,146,0.5)]
                                    "
                                />

                                {/* Pequeno brilho secundário */}
                                <motion.div
                                    initial={{
                                        x: 0,
                                        y: 0,
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: -15,
                                        y: -55,
                                        scale: [0, 0.8, 0],
                                        opacity: [0, 0.8, 0],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.05,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-1/2
                                        top-1/2
                                        z-20
                                        h-1.5
                                        w-1.5
                                        -translate-x-1/2
                                        -translate-y-1/2
                                        rounded-full
                                        bg-[#FFCD92]
                                        shadow-[0_0_10px_#FFCD92]
                                    "
                                />

                                {/* Outro pequeno ponto */}
                                <motion.div
                                    initial={{
                                        x: 0,
                                        y: 0,
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: 5,
                                        y: -110,
                                        scale: [0, 0.6, 0],
                                        opacity: [0, 0.7, 0],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.1,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-1/2
                                        top-1/2
                                        z-20
                                        h-1
                                        w-1
                                        -translate-x-1/2
                                        -translate-y-1/2
                                        rounded-full
                                        bg-white
                                        shadow-[0_0_8px_white]
                                    "
                                />
                            </>
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={{
                            scale: isAdding ? [1, 0.97, 1.02, 1] : 1,
                        }}
                        transition={{
                            duration: 0.45,
                            ease: "easeOut",
                        }}
                    >
                        <Button
                            onClick={handleAddToCart}
                            disabled={!(total > 0) || isAdding}
                            isdisabled={!(total > 0) || isAdding}
                            className="w-full"
                        >
                            <AnimatePresence mode="wait">
                                {isAdding ? (
                                    <motion.span
                                        key="added"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        ✓ Adicionado
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="add"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Adicionar ao carrinho
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </div>

                <Button
                    onClick={handleBuyNow}
                    disabled={!(total > 0)}
                    isdisabled={!(total > 0)}
                >
                    Comprar agora —{" "}
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(total)}
                </Button>
            </div>
        </div>
    );
}