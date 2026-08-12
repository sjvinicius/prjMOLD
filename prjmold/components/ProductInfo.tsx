import { Product } from "@/types/product";
import Link from "next/link";
import { Button } from "./ui/Button";

interface ProductInfoProps {
    plant: Product;
    base: Product;
}

export default function ProductInfo({
    plant,
    base,
}: ProductInfoProps) {
    const total = plant.price + base.price;

    return (
        <div className="flex flex-col">

            <span className="mb-2 text-[10px] uppercase tracking-[5px] text-[#FFCD92]">
                Coleção Bio Luz
            </span>

            <h1 className="mb-10 text-5xl font-semibold leading-none text-white">
                Bio Luz{" "}
                <span className="text-[#FFCD92]">
                    {plant.name}
                </span>
            </h1>

            {/* Planta */}

            <section className="mb-8">

                <span className="mb-5 inline-block rounded bg-[#FFCD92]/10 px-3 py-1 text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                    Detalhes da Planta
                </span>

                <div className="grid grid-cols-2 gap-6">
                    {
                        plant.details?.map((detail, index) => {
                            return (
                                <div key={index}>
                                    <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                                        {detail.label}
                                    </small>

                                    <p className="text-sm text-white">
                                        {detail.description}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>

            </section>

            {/* Base */}

            <section>

                <span className="mb-5 inline-block rounded bg-[#FFCD92]/10 px-3 py-1 text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                    Detalhes da Base
                </span>

                <div className="grid grid-cols-2 gap-6">

                    {
                        base.details?.map((detail, index) => {
                            return (
                                <div key={index}>
                                    <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                                        {detail.label}
                                    </small>

                                    <p className="text-sm text-white">
                                        {detail.description}
                                    </p>
                                </div>
                            )
                        })
                    }

                </div>

            </section>

            <Link href={`/checkout?plant=${plant.id}&base=${base.id}`} className="flex w-full justify-center">
                <Button
                    className={`mt-12`}
                    disabled={!(total > 0)}
                    isdisabled={!(total > 0)}
                >
                    {total > 0 ? `Adicionar ao carrinho — R$ ${new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(total)}` : "Escolha um produto"}
                </Button>
            </Link>
        </div>
    );
}