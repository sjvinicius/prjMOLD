export interface ProductDetail {
    label: string;
    description: string;
}

export type ProductType = "plant" | "base";

export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    type: ProductType;
    details: ProductDetail[];
}