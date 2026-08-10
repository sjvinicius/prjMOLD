
'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import type { User } from "@supabase/supabase-js";

import { ShoppingCart } from "lucide-react";

import { Base, Plant } from "@/types/product";
import Link from "next/link";


interface HeaderContentProps {
    user: User | null;
    cart: Base[] | Plant[] | null;
}

export default function HeaderContent({ user, cart }: HeaderContentProps) {

    const pathname = usePathname();

    if (pathname === "/signin") {
        return null;
    }

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll(); // verifica ao carregar

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // const cartCount = user
    // ? await getCartCount(user.id)
    // : 0;

    return (<header className="">
        <nav
            className={`fixed top-0 z-50 flex w-full items-center justify-between px-[8%] py-2 transition-all duration-300 
                    ${scrolled
                    ? "bg-black/90 backdrop-blur-md shadow-lg"
                    : "bg-linear-to-b from-black/50 to-transparent"
                }`}
        >
            <a href="/">
                <Image
                    src="/logo_escrita.png"
                    width={70}
                    height={40}
                    loading="eager"
                    alt="Estúdio Mol·D"
                    className="w-auto transition-transform duration-300 hover:scale-105"
                />
            </a>

            <div className="flex items-center gap-9">
                <a className="text-xs uppercase tracking-[2px] text-white/60 transition hover:text-[#FFCD92]" href="/products">
                    Produtos
                </a>

                <a className="text-xs uppercase tracking-[2px] text-white/60 transition hover:text-[#FFCD92]" href="/about">
                    Sobre
                </a>

                {!user && (
                    <a className="text-xs uppercase tracking-[2px] text-white/60 transition hover:text-[#FFCD92]" href="/signin">
                        Entrar
                    </a>
                )}

                <div className="ml-12 flex items-center justify-center">
                    <Image
                        src="/logo_simbolo.png"
                        width={100}
                        height={100}
                        alt="Símbolo"
                        className="h-auto transition duration-300 hover:rotate-90 hover:scale-110"
                    />
                    {user && (
                        <Link href="/cart" className="relative">
                            <ShoppingCart />

                                <span className="
                                    absolute -right-3 -bottom-2
                                    flex h-4 min-w-4
                                    items-center justify-center
                                    rounded-full
                                    bg-[#FFCD92]
                                    px-1
                                    text-[9px]
                                    font-semibold
                                    text-black
                                ">
                                    {cart?.length || 0}
                                </span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    </header >
    );
}