import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminOrdersClient from "@/components/AdminOrdersClient";

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    const role = user.app_metadata?.role?.toUpperCase();

    if (role !== "ADMIN" && role !== "MANAGER") {
        redirect("/products");
    }

    return <AdminOrdersClient />;
}