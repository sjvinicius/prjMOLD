import { Product, ProductType } from "@/types/product";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProductsByType(
    type: ProductType
): Promise<Product[]> {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product")
        .select(`
            product_id,
            name,
            imagepath,
            price,
            type,
            detailproduct (
                label,
                datail
            )
        `)
        .eq("type", type)
        .eq("status", "A");

    if (error) {
        throw new Error(
            `Erro ao buscar produtos do tipo ${type}: ${error.message}`
        );
    }

    const products = await Promise.all(
        data.map(async product => ({
            id: product.product_id,
            name: product.name,
            image: await getStoragePublicUrl(product.imagepath),
            price: product.price,
            type: product.type,
            details: product.detailproduct.map(detail => ({
                label: detail.label,
                description: detail.datail,
            })),
        }))
    );
    return products;
}

export async function getStoragePublicUrl(pathname: string) {
    const supabase = await createClient();
    
    return supabase.storage
        .from("products")
        .getPublicUrl(pathname)
        .data.publicUrl
}