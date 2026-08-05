import Image from "next/image";
export default function About() {

    return (
        <section className="relative flex min-h-screen  items-center justify-center overflow-hidden">

            <Image className="bg-layer layer-1 object-cover" loading="eager" src="/about_1.jpg" fill sizes="100vw" alt="" />
            <Image className="bg-layer layer-2 object-cover" loading="eager" src="/about_2.jpg" fill sizes="100vw" alt="" />
            <Image className="bg-layer layer-3 object-cover" loading="eager" src="/about_3.jpg" fill sizes="100vw" alt="" />
            <Image className="bg-layer layer-4 object-cover" loading="eager" src="/about_4.jpg" fill sizes="100vw" alt="" />

            <div
                className="relative z-10 mx-auto w-screen h-screen px-[8%] py-32 bg-black/60"
            >
                <div className="mb-16 max-w-4xl">
                    <span className="sub-title">O Manifesto</span>

                    <h1 className="main-title">
                        A Mol·D nasce da transformação de ideias em presença.
                    </h1>

                    <p className="mb-10 text-[1.4rem] leading-relaxed font-light opacity-90">
                        Mais do que objetos, criamos sensações. Cada peça é o
                        resultado de um processo integral — da concepção à
                        fabricação — conduzido com precisão e intenção.
                    </p>

                    <div className="flex flex-col gap-8 md:flex-row md:gap-10">
                        <div>
                            <strong className="mb-2 block text-[11px] uppercase tracking-[2px] text-bege">
                                Processo Integral
                            </strong>

                            <p className="text-[0.95rem] opacity-70">
                                Do projeto ao polímero, controle total sobre
                                cada curva.
                            </p>
                        </div>

                        <div>
                            <strong className="mb-2 block text-[11px] uppercase tracking-[2px] text-bege">
                                Equilíbrio
                            </strong>

                            <p className="text-[0.95rem] opacity-70">
                                Design minimalista feito para trazer aconchego
                                ao cotidiano.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[20px] border border-bege/10 bg-bege/5 p-12 text-center backdrop-blur-sm">
                    <blockquote className="text-[1.6rem] italic text-bege">
                        "Ideias, por mais distantes que pareçam, podem ganhar forma."
                    </blockquote>
                </div>

                <div className="mt-12">
                    <div className="mb-6 h-px w-24 bg-bege/20" />

                    <p className="text-sm opacity-70">
                        Design, branding e execução por: 
                        <strong> Gustavo Xavier</strong>.
                    </p>
                    <p className="text-sm opacity-70">
                        Desenvolvido por: 
                        <strong> Vinícius Silva</strong>.
                    </p>
                </div>
            </div>
        </section>
    );
}