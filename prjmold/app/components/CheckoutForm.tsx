"use client";

import { useState } from "react";

import PaymentSelector from "./PaymentSelector";
import { Input } from "./ui/Input";

export default function CheckoutForm() {
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");

    const [email, setEmail] = useState("");
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [complement, setComplement] = useState("");

    const formatCEP = (value: string) => {
        value = value.replace(/\D/g, "");

        if (value.length > 5) {
            value = value.slice(0, 5) + "-" + value.slice(5, 8);
        }

        return value;
    };

    return (
        <div className="checkout-form-column">
            <span className="collection-name">
                Finalizar Pedido
            </span>

            <h2 className="mb-8 text-4xl">
                Informações de Envio
            </h2>

            <form
                className="login-form"
                onSubmit={(e) => e.preventDefault()}
            >
                <Input
                    type="email"
                    label="E-mail para confirmação"
                    placeholder="seu@email.com"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="grid w-full grid-cols-[140px_100px_1fr] gap-4">
                    <Input
                        type="text"
                        label="CEP"
                        placeholder="00000-000"
                        className="w-full"
                        value={cep}
                        onChange={(e) =>
                            setCep(formatCEP(e.target.value))
                        }
                    />


                    <Input
                        type="text"
                        label="Número"
                        placeholder="123"
                        className="w-full"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />


                    <Input
                        type="text"
                        label="Bairro"
                        placeholder="Seu bairro"
                        className="w-full"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                </div>

                <div className="input-group">

                    <Input
                        type="text"
                        label="Endereço"
                        placeholder="Rua, Avenida..."
                        className="w-full"
                        value={address}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4">

                    <Input
                        type="text"
                        label="Cidade"
                        placeholder="São Paulo..."
                        className="w-full"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />


                    <Input
                        type="text"
                        label="Complemento"
                        placeholder="Ex: Apto 12, Bloco B"
                        className="w-full"
                        value={complement}
                        onChange={(e) =>
                            setComplement(e.target.value)
                        }
                    />
                </div>

                <h2 className="mt-10 mb-5 text-3xl">
                    Pagamento
                </h2>

                <PaymentSelector
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
            </form>
        </div>
    );
}