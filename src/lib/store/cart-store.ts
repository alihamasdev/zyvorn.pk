import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getQueryClient } from "@/lib/tanstack/get-query-client";
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
	getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => {
			return {
				cart: [],

				addToCart: (variationId, quantity = 1) => {
					const queryClient = getQueryClient();
					set((state) => {
						const existingItemIndex = state.cart.findIndex((item) => item.variationId === variationId);
						if (existingItemIndex !== -1) {
							queryClient.invalidateQueries({ queryKey: ["cart-products"] });
							const updatedCart = [...state.cart];
							updatedCart[existingItemIndex].quantity += quantity;
							return { cart: updatedCart }; // Update quantity if item exists
						}
						queryClient.invalidateQueries({ queryKey: ["cart-products"] });
						return { cart: [...state.cart, { variationId, quantity }] };
					});
				},

				removeFromCart: async (variationId) => {
					await optimisticUpdate<CartProduct[]>(["cart-products"], (oldData) =>
						oldData ? oldData.filter((item) => !(item.variationId === variationId)) : oldData
					);
					set((state) => ({ cart: state.cart.filter((item) => !(item.variationId === variationId)) }));
				},

				clearCart: () => set({ cart: [] }),

				getTotalItems: () => {
					return get().cart.reduce((total, item) => total + item.quantity, 0);
				}
			};
		},
		{ name: "cart" }
	)
);
