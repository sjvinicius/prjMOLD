import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("e-mail inválido."),

    password: z
        .string()
        .min(1, "senha inválida.")
        .max(32, "senha inválida."),
});

export type LoginFormData = z.infer<typeof loginSchema>;