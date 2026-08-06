import { Base, Plant } from "../types/product";

export const plants: Plant[] = [
    {
        id: 1,
        name: "Monstera",
        image: "/plant_1.png",
        price: 99.99,
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
        id: 2,
        name: "Pacová",
        image: "/plant_2.png",
        price: 119.99,
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

export const bases: Base[] = [
    {
        id: 1,
        type: "Tech",
        image: "/base_tech.png",
        led: "LED Endereçável (RGBW)",
        connection: "USB-C / Wi-Fi",
        resources: "Integração Smart Home / App",
        price: 149.13,
    },
    {
        id: 2,
        type: "Classic",
        image: "/base_simples.png",
        led: "LED Quente",
        connection: "USB-C",
        resources: "Nenhum (Plug & Play)",
        price: 89.99,
    },
];