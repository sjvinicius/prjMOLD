import { z } from "zod";

export const checkoutSchema = z.object({
    email: z
        .string()
        .min(1, "Informe seu e-mail.")
        .email("Informe um e-mail válido."),

    cep: z
        .string()
        .min(1, "Informe seu CEP.")
        .refine(
            (value) => value.replace(/\D/g, "").length === 8,
            "Informe um CEP válido."
        ),

    address: z
        .string()
        .min(1, "Informe seu endereço."),

    number: z
        .string()
        .min(1, "Informe o número."),

    district: z
        .string()
        .min(1, "Informe seu bairro."),

    city: z
        .string()
        .min(1, "Informe sua cidade."),

    complement: z
        .string()
        .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;