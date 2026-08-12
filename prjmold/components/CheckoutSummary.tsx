import Link from "next/link";
import { Product } from "../types/product";
import { Button } from "./ui/Button";

type CheckoutSummaryProps = {
    plant: Product;
    base: Product;
};

export default function CheckoutSummary({
    plant,
    base,
}: CheckoutSummaryProps) {
    const shipping = 25;
    const total = plant.price + base.price + shipping;

    return (
        <aside className="flex flex-col gap-8">
            <div className="rounded-[20px] border border-[#FFCD921A] bg-white/[0.03] p-8 backdrop-blur-xl">

                <small className="mb-6 block text-[10px] uppercase tracking-[2px] text-[#FFCD92]/70">
                    Seu Setup
                </small>

                <div className="mb-4 flex items-center justify-between text-sm">
                    <p className="text-white/80">
                        Módulo Bio Luz{" "}
                        <strong className="font-medium text-[#FFCD92]">
                            {plant.name}
                        </strong>
                    </p>

                    <span>
                        R$ {plant.price.toFixed(2).replace(".", ",")}
                    </span>
                </div>

                <div className="mb-4 flex items-center justify-between text-sm">
                    <p className="text-white/80">
                        Base{" "}
                        <strong className="font-medium text-[#FFCD92]">
                            {base.type}
                        </strong>
                    </p>

                    <span>
                        R$ {base.price.toFixed(2).replace(".", ",")}
                    </span>
                </div>

                <div className="mb-6 flex items-center justify-between text-sm">
                    <p className="text-white/80">
                        Frete
                    </p>

                    <span>
                        R$ {shipping.toFixed(2).replace(".", ",")}
                    </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#FFCD9233] pt-6">
                    <span className="text-lg">
                        Total
                    </span>

                    <h3 className="text-3xl font-semibold text-[#FFCD92]">
                        R$ {total.toFixed(2).replace(".", ",")}
                    </h3>
                </div>

                <Button className="w-full mt-3"> Finalizar e Pagar </Button>

                <p className="mt-4 text-center text-[10px] text-white/50">
                    Ambiente seguro criptografado pela Mol·D
                </p>
            </div>

            <Link
                href="/products"
                className="text-center text-xs uppercase tracking-[2px] text-white/50 transition hover:text-[#FFCD92]"
            >
                ← Alterar Combinação de Módulo e Base
            </Link>
        </aside>
    );
}