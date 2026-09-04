"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { ShoppingCart, X } from "lucide-react";
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

    const { count } = useCart();

    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

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

    if (pathname === "/signin") {
        return null;
    }

    const { items } = useCart();

    const cartQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (cartQuantity === 0) return;

        setPulse(true);

        const timer = setTimeout(() => {
            setPulse(false);
        }, 350);

        return () => clearTimeout(timer);
    }, [cartQuantity]);

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
                    px-[8%] py-2
                    transition-all duration-300
                    ${scrolled
                        ? "bg-black/90 backdrop-blur-md shadow-lg"
                        : "bg-linear-to-b from-black/50 to-transparent"
                    }
                `}
            >

                {/* Logo */}

                <Link href="/">
                    <Image
                        src="/logo_escrita.png"
                        width={70}
                        height={40}
                        loading="eager"
                        alt="Estúdio Mol·D"
                        className="
                            w-auto
                            transition-transform
                            duration-300
                            hover:scale-105
                        "
                    />
                </Link>


                {/* Navegação */}

                <div className="flex items-center gap-9">

                    <Link
                        className="
                            text-xs uppercase
                            tracking-[2px]
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
                            text-xs uppercase
                            tracking-[2px]
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
                                text-xs uppercase
                                tracking-[2px]
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
                        <Button
                            onClick={handleLogout}
                            className="text-xs py-1 opacity-70"
                        >
                            Sair
                        </Button>
                    )}


                    {/* Símbolo + Carrinho */}

                    <div className="ml-12 flex items-center justify-center gap-5">

                        <Image
                            src="/logo_simbolo.png"
                            width={100}
                            height={100}
                            alt="Símbolo"
                            className="
                                h-auto
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
                                        scale: pulse ? [1, 1.5, 1] : 1,
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