import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { getCategories } from "@/lib/dal";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/dashboard/products/form";

async function getProductById(productId: string) {
	"use cache";
	cacheLife("days");
	cacheTag(`dashboard-product-${productId}`);

	const product = await db.product.findUnique({
		where: { id: productId },
		omit: { createdAt: true, updatedAt: true, id: true },
	});

	if (!product) return notFound();

	return {
		...product,
		images: product.images || [],
		description: product.description || "",
		discountPrice: product.discountPrice || undefined,
	};
}

export default async function DashboardProductIdPage({ params }: PageProps<"/dashboard/products/[productId]">) {
	const { productId } = await params;
	const [product, categories] = await Promise.all([getProductById(productId), getCategories()]);

	return <ProductForm defaultValues={product} categories={categories} productId={productId} />;
}
