import Image from "next/image";

export default function Header() {
    return (
        <header >
            <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-linear-to-b from-black/50 to-transparent px-[8%] py-8">
                <a href="/">
                    <Image
                        src="/logo_escrita.png"
                        width={180}
                        height={90}
                        alt="Estúdio Mol·D"
                        className="h-22.5 w-auto transition-transform duration-300 hover:scale-105"
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
        </header>
    );
}