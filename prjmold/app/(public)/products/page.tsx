import ProductConfigurator from "@/components/ProductConfigurator";
import { getProductsByType } from "@/repositories/productRepository";
import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
    "Monte sua luminária",
    "Combine plantas e bases para criar uma luminária Mol·D com design 3D, materiais resistentes e iluminação acolhedora.",
    "/products",
);

export default async function ProductPage() {

    return (
        <main className="min-h-screen text-white">
            <Suspense fallback={<ProductConfiguratorSkeleton />}>
                <ProductData/>
            </Suspense>
        </main>
    );
}

async function ProductData() {
    const [plants, bases] = await Promise.all([
        getProductsByType("plant"),
        getProductsByType("base"),
    ]);

    return (
        <ProductConfigurator
            plants={plants}
            bases={bases}
        />
    );
}

function ProductConfiguratorSkeleton() {
    return (
        <section className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 scale-110 bg-cover bg-center blur-md" />

            <div className="absolute inset-0 bg-black/80" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-[8%] py-24">
                <div className="grid w-full gap-16 rounded-3xl border border-white/10 bg-white/5 p-10 lg:grid-cols-[1.1fr_.9fr]">

                    <div className="flex flex-col gap-6">

                        {/* Planta */}
                        <div className="h-64 animate-pulse rounded-2xl bg-white/10" />

                        {/* Base */}
                        <div className="h-64 animate-pulse rounded-2xl bg-white/10" />

                    </div>

                    {/* Informações */}
                    <div className="flex flex-col gap-6">
                        <div className="h-10 w-2/3 animate-pulse rounded bg-white/10" />
                        <div className="h-6 w-1/2 animate-pulse rounded bg-white/10" />
                        <div className="h-32 animate-pulse rounded bg-white/10" />
                    </div>

                </div>
            </div>
        </section>
    );
}