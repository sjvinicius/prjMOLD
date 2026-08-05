import { useCallback, useState } from "react";

export function useCircularIndex<T>(items: T[]) {
    const [index, setIndex] = useState(0);

    const previous = useCallback(() => {
        setIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items]);

    const next = useCallback(() => {
        setIndex((prev) => (prev + 1) % items.length);
    }, [items]);

    return {
        index,
        current: items[index],
        previous,
        next,
        setIndex,
    };
}