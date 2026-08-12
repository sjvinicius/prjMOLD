"use client";

import Loading from "@/app/loading";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ConfigBlockProps {
    title: string;
    image?: string;
    alt: string;
    onPrevious: () => void;
    onNext: () => void;
}

export default function ConfigBlock({
    title,
    image,
    alt,
    onPrevious,
    onNext,
}: ConfigBlockProps) {

    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const startLoading = () => {
        setShowLoading(true);
        setLoading(true);
    };

    const finishLoading = () => {
        setLoading(false);

        setTimeout(() => {
            setShowLoading(false);
        }, 1200);
    };

    return (
        <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#FFCD92]/30 hover:bg-white/10">

            <button
                type="button"
                onClick={() => {
                    startLoading();
                    onPrevious();
                }}
                className="z-10 p-2 text-4xl text-[#FFCD92]/60 transition hover:scale-110 hover:text-[#FFCD92]"
            >
                &#8249;
            </button>

            <div className="relative flex flex-1 flex-col items-center">

                <span className="absolute -top-2 text-[10px] uppercase tracking-[3px] text-[#FFCD92]/70">
                    {title}
                </span>

                {showLoading && (
                    <div
                        className={`absolute inset-0 z-20 transition-opacity duration-1200 ${loading ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Loading />
                    </div>
                )}

                {image ? <Image
                    key={image}
                    src={image}
                    alt={alt}
                    width={300}
                    height={300}
                    onLoad={finishLoading}
                    className="h-65 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,.6)]"
                /> : <div className="mt-5 flex h-65 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/40">
                    Nenhum produto selecionado
                </div>}

            </div>

            <button
                type="button"
                onClick={() => {
                    startLoading();
                    onNext();
                }}
                className="z-10 p-2 text-4xl text-[#FFCD92]/60 transition hover:scale-110 hover:text-[#FFCD92]"
            >
                &#8250;
            </button>

        </div>
    );
}