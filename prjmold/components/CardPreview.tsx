import Image from "next/image";

type CardPreviewProps = {
    number: string;
    expiry: string;
    cvv: string;
};

export default function CardPreview({
    number,
    expiry,
    cvv,
}: CardPreviewProps) {
    return (
        <div className="flex w-full min-w-0 justify-center animate-in fade-in slide-in-from-right-5 duration-500">
            <div
                className="
                    relative
                    aspect-[1.586/1]
                    w-full
                    max-w-85
                    min-w-0
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#FFCD9233]
                    bg-white/5
                    p-4
                    shadow-[0_30px_60px_rgba(0,0,0,.5)]
                    backdrop-blur-xl
                    sm:max-w-85
                    sm:rounded-[20px]
                    sm:p-6
                "
            >
                {/* Brilho */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.06),transparent_70%)]" />

                {/* Topo */}
                <div className="relative flex items-center justify-between">
                    <div
                        className="
                            h-7
                            w-9
                            rounded-md
                            bg-linear-to-br
                            from-[#f5cd92]
                            to-[#d4af37]
                            opacity-80
                            shadow-inner
                            sm:h-8.75
                            sm:w-11.25
                        "
                    />

                    <Image
                        src="/logo_simbolo.png"
                        alt="Logo símbolo da MOL-D"
                        width={50}
                        height={50}
                        className="
                            h-9
                            w-auto
                            brightness-0
                            invert
                            sm:h-12
                        "
                    />
                </div>

                {/* Número */}
                <div
                    className="
                        relative
                        my-3
                        truncate
                        font-mono
                        text-[15px]
                        tracking-[2px]
                        text-[#FFCD92]
                        sm:my-4
                        sm:text-[21px]
                        sm:tracking-[3px]
                    "
                >
                    {number
                        .replaceAll(" ", "")
                        .padEnd(16, "•")
                        .match(/.{1,4}/g)
                        ?.join(" ") || "•••• •••• •••• ••••"}
                </div>

                {/* Rodapé */}
                <div className="relative flex gap-6 sm:gap-10">
                    <div>
                        <span className="mb-1 block text-[7px] uppercase tracking-[1.5px] text-[#FFCD92]/60 sm:text-[9px] sm:tracking-widest">
                            Validade
                        </span>

                        <p className="text-xs tracking-[1.5px] text-white sm:text-sm sm:tracking-[2px]">
                            {expiry
                                .replaceAll("/", "")
                                .match(/.{1,2}/g)
                                ?.join("/") || "MM/AA"}
                        </p>
                    </div>

                    <div>
                        <span className="mb-1 block text-[7px] uppercase tracking-[1.5px] text-[#FFCD92]/60 sm:text-[9px] sm:tracking-widest">
                            CVV
                        </span>

                        <p className="text-xs tracking-[1.5px] text-white sm:text-sm sm:tracking-[2px]">
                            {cvv.padEnd(3, "•") || "•••"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}