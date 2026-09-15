"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/context/CartContext";
import CartSidebar from "../CartSideBar";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderContentProps {
    user: User | null;
}

export default function HeaderContent({
    user,
}: HeaderContentProps) {
    const pathname = usePathname();
    const router = useRouter();

    const { count, items } = useCart();
    const role = user?.app_metadata?.role?.toUpperCase();

    const isManager =
        role === "ADMIN" ||
        role === "MANAGER";

    const [scrolled, setScrolled] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

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

        setMobileMenuOpen(false);

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
                {/* Mobile: Menu + Logo */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Abrir menu"
                        onClick={() => setMobileMenuOpen(true)}
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-center
                            text-white
                            transition
                            hover:text-[#FFCD92]
                            md:hidden
                        "
                    >
                        <Menu
                            size={23}
                            strokeWidth={1.7}
                        />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="shrink-0"
                    >
                        <Image
                            src="/logo_escrita.png"
                            width={120}
                            height={50}
                            loading="eager"
                            alt="Logo escrita da MOL·D"
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
                </div>

                {/* Navegação Desktop */}
                <div
                    className="
                        hidden
                        items-center
                        gap-4
                        sm:flex
                        sm:gap-6
                        md:gap-9
                        ml-auto
                    "
                >
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
                            {isManager && (
                                <Link
                                    href="/manage/orders"
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
                                >
                                    Gestão
                                </Link>
                            )}

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
                </div>

                {/* Símbolo + Carrinho */}
                <div
                    className="
                        ml-auto
                        flex
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        sm:ml-5
                        md:ml-5
                        md:gap-5
                    "
                >
                    <div className="shrink-0">
                        <Image
                            src="/logo_simbolo.png"
                            width={120}
                            height={120}
                            alt="Logo simbolo da MOL·D"
                            className="
                                block
                                h-16
                                w-16
                                sm:h-13.75
                                sm:w-13.75
                                md:h-20
                                md:w-20
                                transition
                                duration-300
                                hover:rotate-90
                                hover:scale-110
                            "
                        />
                    </div>

                    {user && (
                        <button
                            id="cart-target"
                            type="button"
                            onClick={() => setCartOpen(true)}
                            aria-label="Abrir carrinho"
                            className="
                                relative
                                shrink-0
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
            </nav>

            {/* Menu Mobile */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="
                            fixed
                            inset-0
                            z-60
                            bg-black/60
                            backdrop-blur-sm
                            md:hidden
                        "
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                            className="
                                flex
                                h-full
                                w-70
                                flex-col
                                bg-black
                                px-7
                                py-6
                                shadow-2xl
                            "
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            {/* Cabeçalho do menu */}
                            <div className="flex items-center justify-between">
                                <Image
                                    src="/logo_escrita.png"
                                    width={150}
                                    height={150}
                                    alt="Logo escrita da MOL·D"
                                    className="
                                        h-15
                                        w-15
                                    "
                                />

                                <button
                                    type="button"
                                    aria-label="Fechar menu"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="
                                        text-white/70
                                        transition
                                        hover:text-[#FFCD92]
                                    "
                                >
                                    <X
                                        size={25}
                                        strokeWidth={1.7}
                                    />
                                </button>
                            </div>

                            {/* Links */}
                            <nav className="mt-12 flex flex-col gap-7 h-full">
                                <Link
                                    href="/products"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="
                                        text-sm
                                        uppercase
                                        tracking-[2px]
                                        text-white/70
                                        transition
                                        hover:text-[#FFCD92]
                                    "
                                >
                                    Produtos
                                </Link>

                                <Link
                                    href="/about"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="
                                        text-sm
                                        uppercase
                                        tracking-[2px]
                                        text-white/70
                                        transition
                                        hover:text-[#FFCD92]
                                    "
                                >
                                    Sobre
                                </Link>

                                {!user && (
                                    <Link
                                        href="/signin"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="
                                            text-sm
                                            uppercase
                                            tracking-[2px]
                                            text-white/70
                                            transition
                                            hover:text-[#FFCD92]
                                        "
                                    >
                                        Entrar
                                    </Link>
                                )}

                                {user && (
                                    <>
                                        <Link
                                            href="/orders"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="
                                                text-sm
                                                uppercase
                                                tracking-[2px]
                                                text-white/70
                                                transition
                                                hover:text-[#FFCD92]
                                            "
                                        >
                                            Meus Pedidos
                                        </Link>

                                        {isManager && (
                                            <Link
                                                href="/manage/orders"
                                                className="
                                                    text-sm
                                                    uppercase
                                                    tracking-[2px]
                                                    text-white/70
                                                    transition
                                                    hover:text-[#FFCD92]
                                                "
                                            >
                                                Gestão
                                            </Link>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="
                                                w-fit
                                                text-left
                                                text-sm
                                                uppercase
                                                tracking-[2px]
                                                text-(--color-bege)
                                                transition
                                                hover:text-[#FFCD92]
                                                mt-auto
                                            "
                                        >
                                            Sair
                                        </button>
                                    </>
                                )}
                            </nav>

                            {/* Rodapé */}
                            <div className="mt-auto">
                                <span
                                    className="
                                        text-[10px]
                                        tracking-[2px]
                                        text-white/30
                                    "
                                >
                                    ESTÚDIO MOL·D
                                </span>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

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
