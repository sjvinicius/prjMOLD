"use client";

import CheckoutForm from "@/components/CheckoutForm";
import CheckoutSummary from "@/components/CheckoutSummary";
import { useCart } from "@/context/CartContext";
import { CheckoutFormData } from "@/utils/validations/payment";
import { useState } from "react";

export default function CheckoutPage() {
    const { items } = useCart();

    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePayment = async (
        checkoutData: CheckoutFormData
    ) => {
        setPaymentError(null);
        setLoading(true);

        try {
            const response = await fetch(
                "/api/payment/infinitepay",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customer: checkoutData,
                        items: items.map((item) => ({
                            id: item.id,
                            quantity: item.quantity,
                        })),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : "Não foi possível iniciar o pagamento."
                );
            }

            if (!data.url) {
                throw new Error(
                    "Não foi possível obter o link de pagamento."
                );
            }

            window.location.href = data.url;
        } catch (error) {
            console.error("Payment error:", error);

            // setPaymentError(
            //     error instanceof Error
            //         ? error.message
            //         : "Não foi possível iniciar o pagamento."
            // );
            setPaymentError(
                "Não foi possível iniciar o pagamento."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden py-8 sm:py-12 lg:flex lg:items-center lg:py-24">
            {/* Background */}
            <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-lg"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.9)), url('/fundo_hero.jpg')",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    className="
                        grid
                        gap-8
                        rounded-2xl
                        border
                        border-[#FFCD920D]
                        bg-[rgba(10,10,10,.4)]
                        p-5
                        backdrop-blur-xl
                        sm:gap-10
                        sm:rounded-[30px]
                        sm:p-20
                        lg:grid-cols-[1.1fr_.9fr]
                        lg:gap-16
                        lg:p-14
                    "
                >
                    <CheckoutForm
                        onSubmit={handlePayment}
                    />

                    <CheckoutSummary
                        items={items}
                        loading={loading}
                        error={paymentError}
                    />
                </div>
            </div>
        </section>
    );
}