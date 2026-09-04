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
        <div className="flex w-full justify-center animate-in fade-in slide-in-from-right-5 duration-500">
            <div className="relative flex h-50 w-full max-w-85 flex-col justify-between overflow-hidden rounded-[20px] border border-[#FFCD9233] bg-white/5 p-6 shadow-[0_30px_60px_rgba(0,0,0,.5)] backdrop-blur-xl">

                {/* brilho */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.06),transparent_70%)] pointer-events-none" />

                {/* topo */}
                <div className="relative flex items-center justify-between">
                    <div className="h-[35px] w-[45px] rounded-md bg-gradient-to-br from-[#f5cd92] to-[#d4af37] opacity-80 shadow-inner" />

                    <Image
                        src="/logo_simbolo.png"
                        alt="Mol·D"
                        width={50}
                        height={50}
                        className="h-12 w-auto brightness-0 invert"
                    />
                </div>

                {/* número */}
                <div className="relative my-4 font-mono text-[21px] tracking-[3px] text-[#FFCD92]">
                    {number.replaceAll(" ", "").padEnd(16, "•").match(/.{1,4}/g)?.join(" ") || "•••• •••• •••• ••••"}
                </div>

                {/* rodapé */}
                <div className="relative flex gap-10">
                    <div>
                        <span className="mb-1 block text-[9px] uppercase tracking-widest text-[#FFCD92]/60">
                            Validade
                        </span>

                        <p className="tracking-[2px] text-white">
                            {expiry.replaceAll("/", "").match(/.{1,2}/g)?.join("/") || "MM/AA"}
                        </p>
                    </div>

                    <div>
                        <span className="mb-1 block text-[9px] uppercase tracking-widest text-[#FFCD92]/60">
                            CVV
                        </span>

                        <p className="tracking-[2px] text-white">
                            {cvv.padEnd(3, "•") || "•••"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}