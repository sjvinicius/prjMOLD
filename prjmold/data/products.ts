import { Product } from "@/types/product";


export const plants: Product[] = [
    {
        id: "0",
        name: "Nenhum",
        image: "",
        price: 0,
        type: "plant",
        details: [
            {
                label: "Material",
                description: "-"
            },
            {
                label: "Engate",
                description: "-"
            },
        ]
    },
    {
        id: "1",
        name: "Monstera",
        image: "/plant_1.png",
        price: 99.99,
        type: "plant",
        details: [
            {
                label: "Material",
                description: "PETG Alta Resistência"
            },
            {
                label: "Engate",
                description: "Encaixe Rápido"
            }
        ]
    },
    {
        id: "2",
        name: "Pacová",
        image: "/plant_2.png",
        price: 119.99,
        type: "plant",
        details: [
            {
                label: "Material",
                description: "PETG Alta Resistência"
            },
            {
                label: "Rosca",
                description: "Encaixe Rosqueável"
            }
        ]
    },
];

export const bases: Product[] = [
    {
        id: "0",
        name: "",
        image: "",
        price: 0,
        type: "base",
        details: [
            {
                label: "tipo",
                description: "-"
            }
        ]
    },
    {
        id: "1",
        name: "Base Tech",
        image: "/base_tech.png",
        price: 149.13,
        type: "base",
        details: [
            {
                label: "tipo",
                description: "Tech"
            },
            {
                label: "led",
                description: "LED Endereçável (RGBW)"
            },
            {
                label: "connection",
                description: "USB-C / Wi-Fi"
            },
            {
                label: "resources",
                description: "Integração Smart Home / Ap"
            },
        ]
    },
    {
        id: "2",
        name: "Base Simples",
        image: "/base_simples.png",
        price: 89.99,
        type: "base",
        details: [
            {
                label: "tipo",
                description: "Classic"
            },
            {
                label: "led",
                description: "LED Quente"
            },
            {
                label: "connection",
                description: "USB-C"
            },
            {
                label: "resources",
                description: "Nenhum (Plug & Play)"
            },
        ]
    },
];