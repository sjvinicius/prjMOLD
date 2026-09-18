import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
    "Mol·D - Estúdio de Design e Tecnologia",
    "Conheça a Mol·D: luminárias e objetos de design criados em 3D para transformar ambientes em refúgios de bem-estar.",
    "/",
);

export default function Home() {
    return (
        <>
            <section className="relative flex h-screen items-center overflow-hidden bg-black/60 px-[8%]">
                <div className="relative z-10 max-w-175">
                    <div className="mb-5">
                        <p className="mb-4 text-[9px] font-medium uppercase tracking-[4px] text-[#FFCD92] sm:text-[10px] sm:tracking-[5px]">
                            Estúdio Mol·D
                        </p>

                        <h1 className="text-[clamp(48px,10vw,110px)] leading-[0.9] text-[#FFCD92]">
                            LUZ QUE ACOLHE.
                        </h1>
                    </div>

                    <h2 className="mb-10 max-w-105 text-base text-white/80">
                        Luminárias criadas em 3D com texturas orgânicas para
                        transformar seu ambiente em um refúgio de bem-estar.
                    </h2>

                    <div className="flex flex-wrap gap-5">
                        <a
                            href="/products"
                            className="border border-[#FFCD92]/40 px-8 py-3 text-xs uppercase tracking-[2px] text-[#FFCD92] transition hover:bg-[#FFCD92] hover:text-black"
                        >
                            Ver Peças
                        </a>

                        <a
                            href="/about"
                            className="border border-white/20 px-8 py-3 text-xs uppercase tracking-[2px] text-white transition hover:border-[#FFCD92] hover:bg-[#FFCD92] hover:text-black"
                        >
                            Manifesto
                        </a>
                    </div>
                </div>

                <nav
                    aria-label="Redes sociais da Mol·D"
                    className="absolute bottom-6 left-5 z-10 flex items-center gap-5 sm:bottom-8 sm:left-8 md:left-[8%]"
                >
                    <a
                        href="https://www.instagram.com/mold"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram da Mol·D"
                        className="text-white/50 transition-colors duration-300 hover:text-[#FFCD92]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect
                                width="20"
                                height="20"
                                x="2"
                                y="2"
                                rx="5"
                            />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line
                                x1="17.5"
                                x2="17.51"
                                y1="6.5"
                                y2="6.5"
                            />
                        </svg>
                    </a>

                    <a
                        href="https://x.com/mold"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X da Mol·D"
                        className="text-white/50 transition-colors duration-300 hover:text-[#FFCD92]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                        </svg>
                    </a>

                    <a
                        href="https://www.linkedin.com/company/mold"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn da Mol·D"
                        className="text-white/50 transition-colors duration-300 hover:text-[#FFCD92]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect
                                width="4"
                                height="12"
                                x="2"
                                y="9"
                            />
                            <circle
                                cx="4"
                                cy="4"
                                r="2"
                            />
                        </svg>
                    </a>
                </nav>
            </section>
        </>
    );
}