"use client"

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function Header() {

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


    return (
        <header className="">
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

                    <a className="text-xs uppercase tracking-[2px] text-white/60 transition hover:text-[#FFCD92]" href="/signin">
                        Entrar
                    </a>

                    <Image
                        src="/logo_simbolo.png"
                        width={100}
                        height={100}
                        alt="Símbolo"
                        className="ml-12 h-auto w-25 transition duration-300 hover:rotate-90 hover:scale-110"
                    />
                </div>
            </nav>
        </header >
    );
}