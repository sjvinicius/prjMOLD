import Image from "next/image";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
    "Manifesto e processo",
    "Conheça o manifesto da Mol·D e descubra o processo criativo por trás de cada luminária e objeto de design, unindo tecnologia, materiais e identidade.",
    "/about",
);

export default function About() {

    return (

        <section className="
            relative
            flex
            min-h-screen
            items-center
            justify-center
            overflow-hidden
        ">

            {/* Backgrounds */}

            <Image
                className="bg-layer layer-1 object-cover"
                src="/about_1.jpg"
                sizes="100vw"
                priority
                width={1920}
                height={1280}
                alt="Imagem 1 de fundo mostrando o ambinete de desenvolvimento da MOL-D"
            />

            <Image
                className="bg-layer layer-2 object-cover"
                loading="eager"
                src="/about_2.jpg"
                sizes="100vw"
                width={1920}
                height={1280}
                alt="Imagem 2 de fundo mostrando o ambinete de desenvolvimento da MOL·D"
            />

            <Image
                className="bg-layer layer-3 object-cover"
                loading="eager"
                src="/about_3.jpg"
                sizes="100vw"
                width={1920}
                height={1280}
                alt="Imagem 3 de fundo mostrando o ambinete de desenvolvimento da MOL·D"
            />

            <Image
                className="bg-layer layer-4 object-cover"
                loading="eager"
                src="/about_4.jpg"
                sizes="100vw"
                width={1920}
                height={1280}
                alt="Imagem 4 de fundo mostrando o ambinete de desenvolvimento da MOL·D"
            />


            {/* Overlay + Conteúdo */}

            <div
                className="
                    relative
                    z-10
                    w-full
                    min-h-screen

                    px-5
                    py-28

                    sm:px-8
                    sm:py-32

                    md:px-[8%]
                    md:py-36

                    bg-black/60
                "
            >

                <div className="
                    mx-auto
                    w-full
                    max-w-5xl
                ">

                    {/* Manifesto */}

                    <div className="
                        mb-12
                        max-w-4xl

                        sm:mb-16
                    ">

                        <h1 className="
                            main-title
                            mt-4

                            text-3xl
                            leading-tight

                            sm:text-4xl
                            md:text-5xl
                        ">
                            A Mol·D nasce da transformação de ideias em presença.
                        </h1>

                        <h2 className="sub-title">
                            O Manifesto
                        </h2>

                        <p className="
                            mb-8
                            mt-6

                            text-base
                            leading-relaxed
                            font-light
                            opacity-90

                            sm:mb-10
                            sm:text-lg

                            md:text-[1.4rem]
                        ">
                            Mais do que objetos, criamos sensações. Cada peça é o
                            resultado de um processo integral — da concepção à
                            fabricação — conduzido com precisão e intenção.
                        </p>


                        {/* Valores */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-8

                            sm:grid-cols-2
                            sm:gap-10

                            md:flex
                            md:flex-row
                        ">

                            <div className="max-w-md">

                                <strong className="
                                    mb-2
                                    block
                                    text-[10px]
                                    uppercase
                                    tracking-[2px]
                                    text-bege

                                    sm:text-[11px]
                                ">
                                    Processo Integral
                                </strong>

                                <p className="
                                    text-sm
                                    leading-relaxed
                                    opacity-70

                                    sm:text-[0.95rem]
                                ">
                                    Do projeto ao polímero, controle total sobre
                                    cada curva.
                                </p>

                            </div>


                            <div className="max-w-md">

                                <strong className="
                                    mb-2
                                    block
                                    text-[10px]
                                    uppercase
                                    tracking-[2px]
                                    text-bege

                                    sm:text-[11px]
                                ">
                                    Equilíbrio
                                </strong>

                                <p className="
                                    text-sm
                                    leading-relaxed
                                    opacity-70

                                    sm:text-[0.95rem]
                                ">
                                    Design minimalista feito para trazer aconchego
                                    ao cotidiano.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Manifesto */}

                    <div className="
                        rounded-2xl
                        border
                        border-bege/10
                        bg-bege/5

                        p-6

                        text-center
                        backdrop-blur-sm

                        sm:rounded-[20px]
                        sm:p-10

                        md:p-12
                    ">

                        <blockquote className="
                            text-lg
                            leading-relaxed
                            italic
                            text-bege

                            sm:text-xl

                            md:text-[1.6rem]
                        ">
                            "Ideias, por mais distantes que pareçam, podem ganhar
                            forma."
                        </blockquote>

                    </div>


                    {/* Créditos */}

                    <div className="
                        mt-10

                        sm:mt-12
                    ">

                        <div className="
                            mb-5
                            h-px
                            w-16
                            bg-bege/20

                            sm:mb-6
                            sm:w-24
                        " />

                        <p className="
                            text-xs
                            leading-relaxed
                            opacity-70

                            sm:text-sm
                        ">
                            Design, branding e execução por:
                            <strong className="ml-1">
                                Gustavo Xavier
                            </strong>.
                        </p>

                        <p className="
                            mt-1
                            text-xs
                            leading-relaxed
                            opacity-70

                            sm:text-sm
                        ">
                            Desenvolvido por:
                            <strong className="ml-1">
                                Vinícius Silva
                            </strong>.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}
