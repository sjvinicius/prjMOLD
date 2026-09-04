"use client";

import CheckoutForm from "@/components/CheckoutForm";
import CheckoutSummary from "@/components/CheckoutSummary";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {

    const { items } = useCart();
    
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-24">
            <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-lg"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0,0,0,.8), rgba(0,0,0,.9)), url('/fundo_hero.jpg')",
                }}
            />

            <div className="relative z-10 w-[90%] max-w-7xl">
                <div className="grid gap-16 rounded-[30px] border border-[#FFCD920D] bg-[rgba(10,10,10,.4)] p-14 backdrop-blur-xl lg:grid-cols-[1.1fr_.9fr]">
                    <CheckoutForm />

                    <CheckoutSummary
                        items={items}
                    />
                </div>
            </div>
        </section>
    );
}