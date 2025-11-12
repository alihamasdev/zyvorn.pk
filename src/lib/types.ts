import type { Prisma, Product } from "@/lib/generated/prisma/client";

export const productCardSelect = {
	id: true,
	title: true,
	slug: true,
	images: true,
	originalPrice: true,
	discountedPrice: true,
	variations: {
		select: {
			id: true,
			name: true,
			color: true,
			stock: true
		}
	}
} satisfies Prisma.ProductSelect;

export type ProductCardPayload = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export const productInclude = {
	variations: { select: { id: true, name: true, color: true, stock: true } }
} satisfies Prisma.ProductInclude;

export type ProductPayload = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export interface ProductData extends Product {
	variations: ProductVariation[];
}

export type ProductReview = {
	name: string;
	rating: number;
	comment: string;
	image: string | null;
};

export type ProductCategory = {
	name: string;
	slug: string;
};

export type ProductVariation = {
	id: string;
	name: string;
	color: string;
	stock: number;
};

export type CartProduct = {
	productId: string;
	title: string;
	image: string;
	price: number;
	totalPrice: number;
	quantity: number;
	variationName: string;
	variationId: string;
};
