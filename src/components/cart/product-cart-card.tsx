import Image from "next/image";
import { Trash2Icon } from "lucide-react";

import { useCartStore } from "@/lib/store/cart-store";
import type { CartProduct } from "@/lib/types";

interface ProductCartCardProps {
	showDelete?: boolean;
	showTotalPrice?: boolean;
	data: CartProduct;
}

export function ProductCartCard({ data, showDelete, showTotalPrice }: ProductCartCardProps) {
	const { removeFromCart } = useCartStore();
	return (
		<div className="flex items-center gap-3 px-3 py-2">
			<div className="bg-muted flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg">
				<Image width={100} height={100} alt={data.title} src={data.image} className="aspect-square size-full object-cover" />
			</div>
			<div className="flex flex-col">
				<h3>{data.title}</h3>
				<p className="text-muted-foreground text-sm capitalize">{data.variationName}</p>
				{showDelete && (
					<button type="button" className="text-destructive mt-1 size-5 cursor-pointer" onClick={() => removeFromCart(data.variationId)}>
						<Trash2Icon size={18} />
					</button>
				)}
			</div>
			<div className="ml-auto">
				<p>{`Rs.${showTotalPrice ? data.totalPrice : data.price}`}</p>
				<p className="text-sm">Quantity: {data.quantity}</p>
			</div>
		</div>
	);
}
