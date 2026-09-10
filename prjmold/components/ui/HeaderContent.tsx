
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "./Button";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/context/CartContext";
import CartSidebar from "../CartSideBar";
import { motion } from "framer-motion";

interface HeaderContentProps {
    user: User | null;
}

export default function HeaderContent({
    user,
}: HeaderContentProps) {

    const pathname = usePathname();
    const router = useRouter();

    const { count, items } = useCart();

    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [pulse, setPulse] = useState(false);

    const cartQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (cartQuantity === 0) return;

        setPulse(true);

        const timer = setTimeout(() => {
            setPulse(false);
        }, 350);

        return () => clearTimeout(timer);
    }, [cartQuantity]);

    if (pathname === "/signin") {
        return null;
    }

    const supabase = createClient();

    const handleLogout = async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Erro ao sair:", error);
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <header>

            <nav
                className={`
                    fixed top-0 z-50
                    flex w-full items-center justify-between
                    px-5 sm:px-8 md:px-[8%]
                    py-3 sm:py-2
                    transition-all duration-300

                    ${scrolled
                        ? "bg-black/90 backdrop-blur-md shadow-lg"
                        : "bg-linear-to-b from-black/50 to-transparent"
                    }
                `}
            >

                {/* Logo */}

                <Link href="/" className="shrink-0">

                    <Image
                        src="/logo_escrita.png"
                        width={120}
                        height={50}
                        loading="eager"
                        alt="Estúdio Mol·D"
                        className="
                            h-auto
                            w-15
                            sm:w-28.75
                            md:w-17.5
                            transition-transform
                            duration-300
                            hover:scale-105
                        "
                    />

                </Link>


                {/* Navegação */}

                <div className="
                    flex
                    items-center
                    gap-4
                    sm:gap-6
                    md:gap-9
                ">

                    <Link
                        className="
                            text-[10px]
                            sm:text-xs
                            uppercase
                            tracking-[1.5px]
                            sm:tracking-[2px]
                            text-white/60
                            transition
                            hover:text-[#FFCD92]
                        "
                        href="/products"
                    >
                        Produtos
                    </Link>

                    <Link
                        className="
                            text-[10px]
                            sm:text-xs
                            uppercase
                            tracking-[1.5px]
                            sm:tracking-[2px]
                            text-white/60
                            transition
                            hover:text-[#FFCD92]
                        "
                        href="/about"
                    >
                        Sobre
                    </Link>


                    {/* Login */}

                    {!user && (
                        <Link
                            className="
                                text-[10px]
                                sm:text-xs
                                uppercase
                                tracking-[1.5px]
                                sm:tracking-[2px]
                                text-white/60
                                transition
                                hover:text-[#FFCD92]
                            "
                            href="/signin"
                        >
                            Entrar
                        </Link>
                    )}


                    {/* Logout */}
                    {user && (
                        <>
                            <Link
                                className="
                                    text-[10px]
                                    sm:text-xs
                                    uppercase
                                    tracking-[1.5px]
                                    sm:tracking-[2px]
                                    text-white/60
                                    transition
                                    hover:text-[#FFCD92]
                                "
                                href="/orders"
                            >
                                Meus Pedidos
                            </Link>
                            <Button
                                onClick={handleLogout}
                                className="
                                    px-0
                                    py-1
                                    text-[10px]
                                    sm:text-xs
                                    opacity-70
                                "
                            >
                                Sair
                            </Button>
                        </>

                    )}


                    {/* Símbolo + Carrinho */}

                    <div className="
                        ml-1
                        sm:ml-4
                        md:ml-12
                        flex
                        items-center
                        justify-center
                        sm:gap-2
                        md:gap-5
                        pr-7 
                        sm:pr-0
                        md:pr-0
                    ">

                        <Image
                            src="/logo_simbolo.png"
                            width={120}
                            height={120}
                            alt="Símbolo"
                            className="
                                h-auto
                                w-20
                                sm:w-13.75
                                md:w-20
                                transition
                                duration-300
                                hover:rotate-90
                                hover:scale-110
                            "
                        />


                        {user && (
                            <button
                                id="cart-target"
                                type="button"
                                onClick={() => setCartOpen(true)}
                                aria-label="Abrir carrinho"
                                className="
                                    relative
                                    text-white
                                    transition
                                    hover:text-[#FFCD92]
                                "
                            >

                                <ShoppingCart
                                    size={22}
                                    strokeWidth={1.7}
                                />

                                <motion.span
                                    animate={{
                                        scale: pulse
                                            ? [1, 1.5, 1]
                                            : 1,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        ease: "easeOut",
                                    }}
                                >

                                    {count > 0 && (
                                        <span
                                            className="
                                                absolute
                                                -right-3
                                                -bottom-2
                                                flex
                                                h-4
                                                min-w-4
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#FFCD92]
                                                px-1
                                                text-[9px]
                                                font-semibold
                                                text-black
                                            "
                                        >
                                            {count}
                                        </span>
                                    )}

                                </motion.span>

                            </button>
                        )}

                    </div>

                </div>

            </nav>


            {/* Carrinho */}

            {user && (
                <CartSidebar
                    open={cartOpen}
                    onClose={() => setCartOpen(false)}
                />
            )}

        </header>
    );
}
