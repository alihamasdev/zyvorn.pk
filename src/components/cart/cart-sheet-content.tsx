"use client";
"use no memo";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon, Trash2Icon, TriangleAlertIcon } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useCartContext } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SheetFooter } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { removeItemMutation } from "@/components/cart/mutations";
import { ProductImage } from "@/components/product/product-image";

export function CartSheetContent() {
	const router = useRouter();
	const { setOpen } = useCartContext();
	const { mutate } = removeItemMutation();
	const { data, status, totalAmount, count, cartId } = useCart();

	if (status === "error") {
		return (
			<Empty className="p-4 md:p-0">
				<EmptyContent className="gap-2">
					<EmptyMedia variant="icon">
						<TriangleAlertIcon />
					</EmptyMedia>
					<EmptyDescription>Something went wrong, Please try again!</EmptyDescription>
					<Button
						size="sm"
						className="rounded-full"
						onClick={() => {
							setOpen(false);
							window.location.reload();
						}}
					>
						Retry
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	if (status === "pending") {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<Item key={index} variant="default" className="gap-4 p-0">
						<ItemMedia variant="image" className="size-20">
							<Skeleton className="aspect-square size-full" />
						</ItemMedia>
						<ItemContent>
							<Skeleton className="h-5" />
							<Skeleton className="h-5 w-1/2" />
						</ItemContent>
					</Item>
				))}
			</div>
		);
	}

	if (!count) {
		return (
			<Empty className="p-4 md:p-0">
				<EmptyContent className="gap-2">
					<EmptyMedia variant="icon">
						<ShoppingCartIcon />
					</EmptyMedia>
					<EmptyTitle>Your cart is empty</EmptyTitle>
					<Button
						size="sm"
						className="rounded-full"
						onClick={() => {
							setOpen(false);
							router.push("/collections/all");
						}}
					>
						Go to Shop
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
				{data.map((item) => (
					<Item key={item.id} variant="default" className="gap-3 p-0">
						<ItemMedia className="relative">
							<Link
								href={`/products/${item.slug}`}
								className="bg-muted relative size-20 shrink-0 overflow-hidden rounded-md"
								onClick={() => setOpen(false)}
							>
								<ProductImage src={item.image} alt={item.title} size={80} transformation="thumbnail" />
							</Link>
							<Badge variant="left">{item.quantity}</Badge>
						</ItemMedia>
						<ItemContent>
							<ItemTitle className="line-clamp-1">
								<Link href={`/products/${item.slug}`} onClick={() => setOpen(false)}>
									{item.title}
								</Link>
							</ItemTitle>
							<ItemDescription>Rs&nbsp;{formatPrice(item.price)}</ItemDescription>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={`Remove ${item.title} from cart`}
								onClick={() => mutate({ productId: item.id })}
							>
								<Trash2Icon className="text-destructive size-4" />
								<span className="sr-only">Remove {item.title}</span>
							</Button>
						</ItemContent>
					</Item>
				))}
			</div>
			<SheetFooter className="gap-4 border-t">
				<div className="flex items-center justify-between font-semibold md:text-lg">
					<p>Subtotal:</p>
					<p>Rs&nbsp;{formatPrice(totalAmount)}</p>
				</div>
				<Button
					size="lg"
					className="rounded-full font-semibold uppercase"
					onClick={() => {
						setOpen(false);
						if (data.length > 0 && cartId) {
							router.push(`/checkout/${cartId}`);
						}
					}}
				>
					Checkout
				</Button>
			</SheetFooter>
		</>
	);
}
