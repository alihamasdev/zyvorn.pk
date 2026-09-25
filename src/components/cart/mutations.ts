import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCartContext } from "@/context/cart-context";
import { addToCart, getCart, removeFromCart } from "@/components/cart/actions";

export function addItemMutation() {
	const queryClient = useQueryClient();
	const { setOpen } = useCartContext();

	return useMutation({
		mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
			return await addToCart(productId, quantity);
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: ["cart"] });
			setOpen(true);
		},
		onError: (error) => {
			console.error("Failed to add to cart", error);
			toast.error("Failed to add to cart");
		},
	});
}

export function removeItemMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ productId }: { productId: string }) => {
			return await removeFromCart(productId);
		},
		onMutate: async ({ productId }) => {
			await queryClient.cancelQueries({ queryKey: ["cart"] });

			const previousCart = queryClient.getQueryData<Awaited<ReturnType<typeof getCart>>>(["cart"]);

			queryClient.setQueryData<Awaited<ReturnType<typeof getCart>>>(["cart"], (old) => {
				if (!old) return old;
				return { ...old, items: old.items.filter((item) => item.product.id !== productId) };
			});

			return { previousCart };
		},
		onError: (_err, _newTodo, context) => {
			if (context?.previousCart) {
				queryClient.setQueryData(["cart"], context.previousCart);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
}
