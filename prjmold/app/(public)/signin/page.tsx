import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Entrar",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Signin() {
    return (
        <section
            className="
                relative flex min-h-screen w-full items-center justify-center
                overflow-hidden px-5
                bg-black/60
            "
        >

            <LoginForm />
        </section>
    );
}