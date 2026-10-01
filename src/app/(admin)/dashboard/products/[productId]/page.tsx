import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { getCategories } from "@/lib/dal";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function DashboardProductIdPage({ params }: PageProps<"/dashboard/products/[productId]">) {
	return (
		<Suspense fallback={<ProductFormSkeleton />}>
			<ProductFormContent params={params} />
		</Suspense>
	);
}

async function ProductFormContent({ params }: { params: Promise<{ productId: string }> }) {
	const { productId } = await params;
	const [product, categories] = await Promise.all([getProductById(productId), getCategories()]);

	return <ProductForm defaultValues={product} categories={categories} productId={productId} />;
}

function ProductFormSkeleton() {
	return (
		<div className="grid w-full gap-4 lg:grid-cols-2 xl:grid-cols-3">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />

			<div className="gap-1 lg:col-span-2 xl:col-span-3">
				<Skeleton className="mb-2 h-4 w-16" />
				<Skeleton className="size-30 rounded-md" />
			</div>

			<div className="gap-1 lg:col-span-2 xl:col-span-3">
				<Skeleton className="mb-2 h-4 w-24" />
				<Skeleton className="h-40 w-full rounded-md" />
			</div>

			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<div />

			<Skeleton className="h-9 w-20" />
		</div>
	);
}
