"use client";

// import { plants, bases } from "@/data/products";

import { useCircularIndex } from "@/hooks/useCircularIndex";
import ConfigBlock from "./ConfigBlock";
import ProductInfo from "./ProductInfo";
import { Product } from "@/types/product";

interface ProductConfigurator {
    plants: Product[],
    bases: Product[]
}

export default function ProductConfigurator({ plants, bases }: ProductConfigurator) {
    const plant = useCircularIndex(plants);
    const base = useCircularIndex(bases);

    return (
        <section className="relative min-h-screen overflow-hidden">
            <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-md"
                style={{
                    backgroundImage: "url('/fundo_hero.jpg')",
                }}
            />

            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/70 to-black/90" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-[8%] py-24">
                <div className="grid w-full gap-16 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-2xl lg:grid-cols-[1.1fr_.9fr]">

                    <div className="flex flex-col gap-6">
                        <ConfigBlock
                            title="Módulo Vegetal"
                            image={plant.current.image}
                            alt={plant.current.name}
                            onPrevious={plant.previous}
                            onNext={plant.next}
                        />

                        <ConfigBlock
                            title="Base Tecnológica"
                            image={base.current.image}
                            alt={base.current.name}
                            onPrevious={base.previous}
                            onNext={base.next}
                        />
                    </div>

                    <ProductInfo
                        plant={plant.current}
                        base={base.current}
                    />
                </div>
            </div>
        </section>
    );
}