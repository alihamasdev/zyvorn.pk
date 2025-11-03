import { create } from "zustand";
import { persist } from "zustand/middleware";

import { optimisticUpdate } from "@/lib/tanstack/optimistic-update";
import type { CartProduct } from "@/lib/types";

interface CartItem {
	variationId: string;
	quantity: number;
}

interface CartState {
	cart: CartItem[];
	addToCart: (variationId: string, quantity?: number) => void;
	removeFromCart: (variationId: string) => void;
	clearCart: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set) => {
			return {
				cart: [],

				addToCart: (variationId, quantity = 1) => {
					set((state) => {
						const existingItemIndex = state.cart.findIndex((item) => item.variationId === variationId);
						if (existingItemIndex !== -1) {
							const updatedCart = [...state.cart];
							updatedCart[existingItemIndex].quantity += quantity;
							return { cart: updatedCart };
						}
						return { cart: [...state.cart, { variationId, quantity }] };
					});
				},

				removeFromCart: async (variationId) => {
					set((state) => ({ cart: state.cart.filter((item) => !(item.variationId === variationId)) }));
					await optimisticUpdate<CartProduct[]>(["cart-products"], (oldData) =>
						oldData ? oldData.filter((item) => item.variationId !== variationId) : oldData
					);
				},

				clearCart: () => set({ cart: [] })
			};
		},
		{ name: "cart" }
	)
);
