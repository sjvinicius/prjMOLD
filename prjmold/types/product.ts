export interface Plant {
    id: number;
    name: string;
    image: string;
    price: number;
    details?: {
        label: string;
        description: string;
    }[];
}

export interface Base {
    id: number;
    type: string;
    image: string;
    led: string;
    connection: string;
    resources: string;
    price: number;
}