import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

export default function Signin() {
    return (
        <section
            className="
                relative flex min-h-screen w-full items-center justify-center
                overflow-hidden px-5
                bg-black/60
            "
        >

            {/* Container */}
            <div
                className="relative z-10 w-full max-w-md p-5"
                data-aos="zoom-in"
            >
                {/* Login Box */}
                <div
                    className="
                        w-full
                        rounded-[20px]
                        border border-[#FFCD92]/10
                        bg-white/3
                        px-10 py-12.5
                        text-center
                        backdrop-blur-xl
                        [-webkit-backdrop-filter:blur(20px)]
                    "
                >
                    <span
                        className="
                            text-[10px]
                            uppercase
                            tracking-[2px]
                            text-[#FFCD92]
                        "
                    >
                        Área do Cliente
                    </span>

                    <h2
                        className="
                            mt-2.5
                            text-[1.8rem]
                            font-medium
                            text-white
                        "
                    >
                        Bem-vindo à Mol·D
                    </h2>

                    <p
                        className="
                            mb-8.75
                            mt-3
                            text-[0.9rem]
                            leading-relaxed
                            text-white/60
                        "
                    >
                        Acesse sua conta para acompanhar seus pedidos e
                        projetos autorais.
                    </p>

                    <form className="w-full">

                        <Input
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            className="w-full text-sm"
                        />

                        <Input
                            id="senha"
                            label="Senha"
                            type="password"
                            placeholder="••••••••"
                            className="w-full text-sm"
                        />

                        <Button
                            type="submit"
                            className="
                                mt-5
                                w-full
                                text-[11px]
                            "
                        >
                            Entrar
                        </Button>

                        {/* Footer */}
                        <div
                            className="
                                mt-6.25
                                flex
                                flex-col
                                gap-2.5
                                text-xs
                            "
                        >
                            <a
                                href="#"
                                className="
                                    text-[#FFCD92]/80
                                    no-underline
                                    transition-opacity
                                    hover:text-[#FFCD92]
                                    hover:opacity-100
                                "
                            >
                                Esqueceu a senha?
                            </a>

                            <span className="text-white/60">
                                Não tem conta?{" "}
                                <a
                                    href="#"
                                    className="
                                        text-[#FFCD92]/80
                                        no-underline
                                        transition-opacity
                                        hover:text-[#FFCD92]
                                        hover:opacity-100
                                    "
                                >
                                    Cadastre-se
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}