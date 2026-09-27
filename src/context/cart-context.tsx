"use client";

import { createContext, use, useState } from "react";

type CartContextType = {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	toggleCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCart = () => setIsOpen((prev) => !prev);
	const setOpen = (open: boolean) => setIsOpen(open);

	return <CartContext.Provider value={{ isOpen, setOpen, toggleCart }}>{children}</CartContext.Provider>;
}

export function useCartContext() {
	const context = use(CartContext);
	if (!context) {
		throw new Error("useCartContext must be used within a CartProvider");
	}
	return context;
}
