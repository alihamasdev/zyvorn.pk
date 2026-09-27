import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { type getCart } from "@/components/cart/actions";
import { ProductImage } from "@/components/product/product-image";

export function OrderSummary({ cart }: { cart: NonNullable<Awaited<ReturnType<typeof getCart>>> }) {
	const cartItems = cart.items.map((item) => {
		const product = item.product;
		const price = product.discountPrice ?? product.salePrice;
		const image = product.images?.[0] ?? "";

		return {
			id: product.id,
			title: product.title,
			slug: product.slug,
			quantity: item.quantity,
			price,
			image,
		};
	});

	const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

	return (
		<div className="flex flex-col gap-3 px-2 md:px-0" style={{ "--primary": "oklch(0.21 0.006 285.885)" } as React.CSSProperties}>
			{cartItems.map((item) => (
				<Item key={item.id} variant="default" className="gap-3 p-0">
					<ItemMedia className="relative shrink-0">
						<div className="bg-muted size-16 overflow-hidden rounded-md shadow-sm md:size-20">
							<ProductImage src={item.image} alt={item.title} size={80} transformation="thumbnail" />
						</div>
						<Badge variant="left">{item.quantity}</Badge>
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="line-clamp-2">{item.title}</ItemTitle>
						<ItemDescription>Rs&nbsp;{formatPrice(item.price * item.quantity)}</ItemDescription>
					</ItemContent>
				</Item>
			))}
			<div className="flex items-center justify-between text-sm md:text-base">
				<span>Subtotal</span>
				<span>Rs {formatPrice(totalAmount)}</span>
			</div>
			<div className="flex items-center justify-between text-sm md:text-base">
				<span>Shipping</span>
				<span>Free</span>
			</div>
			<Separator />
			<div className="flex items-center justify-between text-base font-semibold md:text-lg">
				<span>Total</span>
				<span>Rs {formatPrice(totalAmount)}</span>
			</div>
		</div>
	);
}
