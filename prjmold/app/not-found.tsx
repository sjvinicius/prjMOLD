import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <h2 className="text-6xl font-bold">
                404
            </h2>

            <h3 className="mt-4 text-2xl font-semibold">
                Página não encontrada
            </h3>

            <p className="mt-2 max-w-md opacity-70">
                A página que você está procurando não existe ou foi movida.
            </p>

            <Link
                href="/"
                className="mt-8 rounded-full px-6 py-3 text-(--color-bege)"
            >
                <ArrowLeft className="inline-block h-5 w-5 mr-2" />
                Voltar para a página inicial
            </Link>
        </main>
    );
}