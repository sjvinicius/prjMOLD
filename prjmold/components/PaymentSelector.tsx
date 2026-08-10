"use client";

import { useState } from "react";
import CardPreview from "./CardPreview";
import { Button } from "./ui/Button";

type Props = {
    paymentMethod: "pix" | "card";
    setPaymentMethod: React.Dispatch<
        React.SetStateAction<"pix" | "card">
    >;
};

export default function PaymentSelector({
    paymentMethod,
    setPaymentMethod,
}: Props) {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    function formatCardNumber(value: string) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{4})(?=\d)/g, "$1 ")
            .slice(0, 19);
    }

    function formatExpiry(value: string) {
        value = value.replace(/\D/g, "");

        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }

        return value.slice(0, 5);
    }

    function formatCVV(value: string) {
        return value.replace(/\D/g, "").slice(0, 3);
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => setPaymentMethod("pix")}
                    className={`flex-1 rounded-md border px-4 py-3 text-[10px] uppercase tracking-widest transition-all ${paymentMethod === "pix"
                        ? "border-[#FFCD92] bg-[#FFCD9226] text-[#FFCD92] shadow-[0_0_15px_rgba(255,205,146,.2)]"
                        : "border-white/10 bg-white/5 text-white"
                        }`}
                >
                    PIX (5% OFF)
                </button>

                <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 rounded-md border px-4 py-3 text-[10px] uppercase tracking-widest transition-all ${paymentMethod === "card"
                        ? "border-[#FFCD92] bg-[#FFCD9226] text-[#FFCD92] shadow-[0_0_15px_rgba(255,205,146,.2)]"
                        : "border-white/10 bg-white/5 text-white"
                        }`}
                >
                    Cartão de Crédito
                </button>
            </div>

            {paymentMethod === "card" && (
                <>
                    <CardPreview
                        number={cardNumber}
                        expiry={expiry}
                        cvv={cvv}
                    />

                    <div className="space-y-5 rounded-2xl border border-[#FFCD920D] bg-white/5 p-6 backdrop-blur-xl">
                        <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                                Número do Cartão
                            </label>

                            <input
                                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#FFCD92]"
                                value={cardNumber}
                                onChange={(e) =>
                                    setCardNumber(
                                        formatCardNumber(e.target.value)
                                    )
                                }
                                placeholder="0000 0000 0000 0000"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                                    Validade
                                </label>

                                <input
                                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#FFCD92]"
                                    value={expiry}
                                    onChange={(e) =>
                                        setExpiry(
                                            formatExpiry(e.target.value)
                                        )
                                    }
                                    placeholder="MM/AA"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#FFCD92]">
                                    CVV
                                </label>

                                <input
                                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#FFCD92]"
                                    value={cvv}
                                    onChange={(e) =>
                                        setCvv(
                                            formatCVV(e.target.value)
                                        )
                                    }
                                    placeholder="123"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {paymentMethod === "pix" && (
                <>
                    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-[#FFCD920D] bg-white/5 p-6 backdrop-blur-xl">

                        <Button>Gerar QR Code</Button>
                    </div>
                </>
            )}
        </div>
    );
}