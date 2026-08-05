"use client";

import Image from "next/image";

interface ConfigBlockProps {
    title: string;
    image: string;
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
    return (
        <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#FFCD92]/30 hover:bg-white/10">

            <button
                type="button"
                onClick={onPrevious}
                className="z-10 p-2 text-4xl text-[#FFCD92]/60 transition hover:scale-110 hover:text-[#FFCD92]"
            >
                &#8249;
            </button>

            <div className="relative flex flex-1 flex-col items-center">

                <span className="absolute -top-2 text-[10px] uppercase tracking-[3px] text-[#FFCD92]/70">
                    {title}
                </span>

                <Image
                    src={image}
                    alt={alt}
                    width={300}
                    height={300}
                    priority
                    className="h-[260px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,.6)]"
                />

            </div>

            <button
                type="button"
                onClick={onNext}
                className="z-10 p-2 text-4xl text-[#FFCD92]/60 transition hover:scale-110 hover:text-[#FFCD92]"
            >
                &#8250;
            </button>

        </div>
    );
}