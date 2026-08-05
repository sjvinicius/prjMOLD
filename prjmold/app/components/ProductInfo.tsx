import { Base, Plant } from "@/app/types/product";
import Link from "next/link";
import { Button } from "./ui/Button";

interface ProductInfoProps {
    plant: Plant;
    base: Base;
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

                    <div>
                        <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                            Iluminação
                        </small>

                        <p className="text-sm text-white">
                            {base.led}
                        </p>
                    </div>

                    <div>
                        <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                            Conexão
                        </small>

                        <p className="text-sm text-white">
                            {base.connection}
                        </p>
                    </div>

                    <div className="col-span-2">

                        <small className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/40">
                            Recursos
                        </small>

                        <p className="text-sm italic text-white/70">
                            {base.resources}
                        </p>

                    </div>

                </div>

            </section>

            <Button
                className="mt-12 tracking-[2px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,205,146,.25)]"
            >
                Adicionar ao Carrinho — R$ {total},00
            </Button>

        </div>
    );
}