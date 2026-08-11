"use server";

import { createClient } from "@/utils/supabase/server";
import type { LoginFormData } from "@/utils/validations/auth";

export async function login(data: LoginFormData, captchaToken: string) {

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
        options: {
            captchaToken,
        },
    });


    if (error) {
        return {
            success: false,
            error: "autenticação incorreta.",
        };
    }

    return {
        success: true,
    };
}