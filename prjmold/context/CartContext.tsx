"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { Product } from "@/types/product";

export interface CartItem {
    id: string;
    plant: Product;
    base: Product;
    quantity: number;
}

interface CartContextProps {
    items: CartItem[];
    addItem: (plant: Product, base: Product) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextProps | null>(null);

export function CartProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    /*
     * Total do carrinho
     */
    const total = items.reduce(
        (sum, item) =>
            sum +
            (item.plant.price + item.base.price) * item.quantity,
        0
    );

    /*
     * Carrega o carrinho salvo
     */
    useEffect(() => {

        const stored = localStorage.getItem("mol-d-cart");

        if (stored) {

            try {
                setItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem("mol-d-cart");
            }

        }

        setLoaded(true);

    }, []);

    /*
     * Persiste o carrinho
     */
    useEffect(() => {

        if (!loaded) {
            return;
        }

        localStorage.setItem(
            "mol-d-cart",
            JSON.stringify(items)
        );

    }, [items, loaded]);

    /*
     * Adicionar produto
     */
    function addItem(
        plant: Product,
        base: Product
    ) {

        const id = `${plant.id}-${base.id}`;

        setItems(current => {

            const existing = current.find(
                item => item.id === id
            );

            if (existing) {

                return current.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                );

            }

            return [
                ...current,
                {
                    id,
                    plant,
                    base,
                    quantity: 1,
                },
            ];

        });
    }

    /*
     * Remover produto
     */
    function removeItem(id: string) {

        setItems(current =>
            current.filter(
                item => item.id !== id
            )
        );

    }

    /*
     * Alterar quantidade
     */
    function updateQuantity(
        id: string,
        quantity: number
    ) {

        if (quantity <= 0) {
            removeItem(id);
            return;
        }

        setItems(current =>
            current.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity,
                    }
                    : item
            )
        );

    }

    /*
     * Limpar carrinho
     */
    function clearCart() {
        setItems([]);
    }

    /*
     * Quantidade total de produtos
     */
    const count = items.reduce(
        (sum, item) =>
            sum + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                count,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {

    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart deve ser utilizado dentro de CartProvider"
        );
    }

    return context;
}