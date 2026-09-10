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
        <div className="w-full min-w-0 space-y-6">
            {/* Métodos de pagamento */}
            <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={() => setPaymentMethod("pix")}
                    className={`
                        min-w-0
                        rounded-md
                        border
                        px-2
                        py-3
                        text-[9px]
                        uppercase
                        tracking-[1.5px]
                        transition-all
                        sm:px-4
                        sm:text-[10px]
                        sm:tracking-widest
                        ${
                            paymentMethod === "pix"
                                ? "border-[#FFCD92] bg-[#FFCD9226] text-[#FFCD92] shadow-[0_0_15px_rgba(255,205,146,.2)]"
                                : "border-white/10 bg-white/5 text-white"
                        }
                    `}
                >
                    PIX (5% OFF)
                </button>

                <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`
                        min-w-0
                        rounded-md
                        border
                        px-2
                        py-3
                        text-[9px]
                        uppercase
                        tracking-[1.5px]
                        transition-all
                        sm:px-4
                        sm:text-[10px]
                        sm:tracking-widest
                        ${
                            paymentMethod === "card"
                                ? "border-[#FFCD92] bg-[#FFCD9226] text-[#FFCD92] shadow-[0_0_15px_rgba(255,205,146,.2)]"
                                : "border-white/10 bg-white/5 text-white"
                        }
                    `}
                >
                    Cartão de Crédito
                </button>
            </div>

            {/* Cartão */}
            {paymentMethod === "card" && (
                <div className="w-full min-w-0 space-y-5">
                    {/* Preview */}
                    <div className="w-full min-w-0 overflow-hidden">
                        <CardPreview
                            number={cardNumber}
                            expiry={expiry}
                            cvv={cvv}
                        />
                    </div>

                    {/* Dados do cartão */}
                    <div className="w-full min-w-0 space-y-5 overflow-hidden rounded-2xl border border-[#FFCD920D] bg-white/5 p-4 backdrop-blur-xl sm:p-6">
                        <div className="min-w-0">
                            <label className="mb-2 block text-[9px] uppercase tracking-[1.5px] text-[#FFCD92] sm:text-[10px] sm:tracking-[2px]">
                                Número do Cartão
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                className="w-full min-w-0 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none transition focus:border-[#FFCD92] sm:px-4"
                                value={cardNumber}
                                onChange={(e) =>
                                    setCardNumber(
                                        formatCardNumber(
                                            e.target.value
                                        )
                                    )
                                }
                                placeholder="0000 0000 0000 0000"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="min-w-0">
                                <label className="mb-2 block text-[9px] uppercase tracking-[1.5px] text-[#FFCD92] sm:text-[10px] sm:tracking-[2px]">
                                    Validade
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                    className="w-full min-w-0 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none transition focus:border-[#FFCD92] sm:px-4"
                                    value={expiry}
                                    onChange={(e) =>
                                        setExpiry(
                                            formatExpiry(
                                                e.target.value
                                            )
                                        )
                                    }
                                    placeholder="MM/AA"
                                />
                            </div>

                            <div className="min-w-0">
                                <label className="mb-2 block text-[9px] uppercase tracking-[1.5px] text-[#FFCD92] sm:text-[10px] sm:tracking-[2px]">
                                    CVV
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-csc"
                                    className="w-full min-w-0 rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none transition focus:border-[#FFCD92] sm:px-4"
                                    value={cvv}
                                    onChange={(e) =>
                                        setCvv(
                                            formatCVV(
                                                e.target.value
                                            )
                                        )
                                    }
                                    placeholder="123"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PIX */}
            {paymentMethod === "pix" && (
                <div className="flex w-full flex-col items-center justify-center gap-5 rounded-2xl border border-[#FFCD920D] bg-white/5 p-5 text-center backdrop-blur-xl sm:gap-6 sm:p-6">
                    <Button className="w-full sm:w-auto">
                        Gerar QR Code
                    </Button>
                </div>
            )}
        </div>
    );
}
