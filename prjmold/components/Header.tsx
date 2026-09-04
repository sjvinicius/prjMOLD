import { createClient } from "@/utils/supabase/server";
import HeaderContent from "@/components/ui/HeaderContent";

export default async function Header() {

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return <>
        <HeaderContent user={user} />
    </>    
}