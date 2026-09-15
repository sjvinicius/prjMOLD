import Image from "next/image";

export default function Loading() {
    return (
        <main className="fixed 
            inset-0 
            z-999999999
            flex
            flex-col
            bg-black/90
            transition-opacity
            duration-1200
            ease-out
            opacity-100
            items-center 
            justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-pulse">
                    <Image
                        src="/logo_simbolo.png"
                        alt="Logo símbolo da MOL-D"
                        width={80}
                        height={80}
                        priority
                    />
                </div>

                <div className="mt-6 flex gap-1">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-[#FFCD92]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-[#FFCD92] [animation-delay:150ms]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-[#FFCD92] [animation-delay:300ms]" />
                </div>
            </div>
        </main>
    );
}