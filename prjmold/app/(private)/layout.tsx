import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }


    return (
        <>
            {children}
        </>
    );
}