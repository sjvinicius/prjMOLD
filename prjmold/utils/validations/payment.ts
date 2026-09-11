import { z } from "zod";

export const checkoutSchema = z.object({
    email: z
        .string()
        .min(1, "Informe seu e-mail.")
        .max(254, "E-mail inválido.")
        .email("Informe um e-mail válido."),

    cep: z
        .string()
        .min(1, "Informe seu CEP.")
        .max(9, "Informe um CEP válido.")
        .refine(
            (value) => value.replace(/\D/g, "").length === 8,
            "Informe um CEP válido."
        ),

    address: z
        .string()
        .min(1, "Informe seu endereço.")
        .max(160, "Endereço inválido."),

    number: z
        .string()
        .min(1, "Informe o número.")
        .max(30, "Número inválido."),

    district: z
        .string()
        .min(1, "Informe seu bairro.")
        .max(100, "Bairro inválido."),

    city: z
        .string()
        .min(1, "Informe sua cidade.")
        .max(100, "Cidade inválida."),

    complement: z
        .string()
        .max(200, "Complemento muito longo.")
        .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;