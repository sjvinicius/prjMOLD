"use client";

import { useState } from "react";

import { Input } from "./ui/Input";

import {
    CheckoutFormData,
    checkoutSchema,
} from "@/utils/validations/payment";

type CheckoutFormProps = {
    onSubmit: (data: CheckoutFormData) => void;
};

export default function CheckoutForm({
    onSubmit,
}: CheckoutFormProps) {
    const [email, setEmail] = useState("");
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [complement, setComplement] = useState("");

    const [errorForm, setErrorForm] = useState<string | null>(null);
    const [loadingCep, setLoadingCep] = useState(false);

    const formatCEP = (value: string) => {
        value = value.replace(/\D/g, "");

        if (value.length > 5) {
            value =
                value.slice(0, 5) +
                "-" +
                value.slice(5, 8);
        }

        return value;
    };

    const handleCepChange = async (
        value: string
    ) => {
        const formattedCep = formatCEP(value);

        setCep(formattedCep);
        setErrorForm(null);

        const cleanCep = formattedCep.replace(/\D/g, "");

        // Enquanto o CEP não estiver completo,
        // libera os campos e limpa os dados da API.
        if (cleanCep.length !== 8) {
            setAddress("");
            setDistrict("");
            setCity("");
            return;
        }

        setLoadingCep(true);

        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${cleanCep}/json/`
            );

            if (!response.ok) {
                throw new Error(
                    "Não foi possível consultar o CEP."
                );
            }

            const data = await response.json();

            if (data.erro) {
                setErrorForm("CEP não encontrado.");
                setAddress("");
                setDistrict("");
                setCity("");
                return;
            }

            setAddress(data.logradouro || "");
            setDistrict(data.bairro || "");
            setCity(
                data.localidade
                    ? `${data.localidade}${data.uf ? " - " + data.uf : ""}`
                    : ""
            );
        } catch (error) {
            console.error("Erro ao consultar CEP:", error);

            setErrorForm(
                "Não foi possível consultar o CEP."
            );

            setAddress("");
            setDistrict("");
            setCity("");
        } finally {
            setLoadingCep(false);
        }
    };

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const result = checkoutSchema.safeParse({
            email: email.trim(),
            cep: cep.trim(),
            address: address.trim(),
            number: number.trim(),
            district: district.trim(),
            city: city.trim(),
            complement: complement.trim(),
        });

        if (!result.success) {
            setErrorForm(
                result.error.issues[0].message
            );
            return;
        }

        setErrorForm(null);

        onSubmit(result.data);
    };

    return (
        <div className="min-w-0">
            <span className="collection-name">
                Finalizar Pedido
            </span>

            <h2 className="mt-2 mb-6 text-3xl sm:mb-8 sm:text-4xl">
                Informações de Envio
            </h2>

            <form
                id="checkout-form"
                className="flex w-full flex-col gap-5 sm:gap-6"
                onSubmit={handleSubmit}
            >
                <Input
                    type="email"
                    label="E-mail para confirmação"
                    placeholder="seu@email.com"
                    className="w-full"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                {/* CEP + Número */}
                <div className="grid w-full grid-cols-[1fr_100px] gap-4 sm:grid-cols-[140px_100px]">
                    <Input
                        type="text"
                        label="CEP"
                        placeholder="00000-000"
                        className="w-full"
                        value={cep}
                        onChange={(e) =>
                            handleCepChange(e.target.value)
                        }
                    />

                    <Input
                        type="text"
                        label="Número"
                        placeholder="123"
                        className="w-full"
                        value={number}
                        onChange={(e) =>
                            setNumber(e.target.value)
                        }
                    />
                </div>

                {/* Endereço */}
                <Input
                    type="text"
                    label="Endereço"
                    placeholder={
                        loadingCep
                            ? "Buscando endereço..."
                            : "Rua, Avenida..."
                    }
                    className="w-full"
                    value={address}
                    disabled={
                        loadingCep ||
                        cep.replace(/\D/g, "").length === 8
                    }
                    onChange={(e) =>
                        setAddress(e.target.value)
                    }
                />

                {/* Bairro */}
                <Input
                    type="text"
                    label="Bairro"
                    placeholder="Seu bairro"
                    className="w-full"
                    value={district}
                    disabled={
                        loadingCep ||
                        cep.replace(/\D/g, "").length === 8
                    }
                    onChange={(e) =>
                        setDistrict(e.target.value)
                    }
                />

                {/* Cidade + Complemento */}
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-[140px_1fr] sm:gap-4">
                    <Input
                        type="text"
                        label="Cidade"
                        placeholder="São Paulo..."
                        className="w-full"
                        value={city}
                        disabled={
                            loadingCep ||
                            cep.replace(/\D/g, "").length === 8
                        }
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
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

                <span
                    className={`text-xs ${loadingCep
                            ? "text-white"
                            : "text-red-500"
                        }`}
                >
                    {loadingCep
                        ? "Buscando endereço..."
                        : errorForm}
                </span>
            </form>
        </div>
    );
}