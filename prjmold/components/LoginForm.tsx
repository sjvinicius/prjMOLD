"use client"
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "@/utils/validations/auth";
import { login } from "@/actions/auth";
import { useRef, useState } from "react";
import { redirect } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import HCaptchaHandle from "@hcaptcha/react-hcaptcha";

export default function LoginForm() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const [errorauth, setErrorAuth] = useState<string | null>(null)
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const captcha = useRef<HCaptchaHandle>(null);

    const loginSubmit = async (data: LoginFormData) => {
        setErrorAuth(null)

        if (!captchaToken) {
            setErrorAuth("Confirme o captcha.");
            return;
        }

        const result = await login(
            data,
            captchaToken
        );

        captcha.current?.resetCaptcha()

        if (result.error) {
            setErrorAuth(result.error)
            return
        }

        redirect("/products");
    }

    return <>
        {/* Container */}
        <div
            className="relative z-10 w-full max-w-md p-5"
            data-aos="zoom-in"
        >
            {/* Login Box */}
            <div
                className="
                        w-full
                        rounded
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

                <form className="w-full flex flex-col gap-5 justify-center items-center"
                    onSubmit={handleSubmit(loginSubmit)}>

                    <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full text-sm lowercase"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Input
                        id="password"
                        label="Senha"
                        type="password"
                        placeholder="••••••••"
                        className="w-full text-sm"
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <span className="text-xs text-red-500">{errorauth}</span>

                    <Button
                        type="submit"
                        className="
                                w-full
                                text-[11px]"
                    >
                        Entrar
                    </Button>

                    <HCaptcha
                        ref={captcha}
                        sitekey="a8ea6550-2ede-4b78-8492-03be66a2b062"
                        theme="dark"
                        onVerify={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken(null)}
                        onError={() => setCaptchaToken(null)}
                    />

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
    </>
}