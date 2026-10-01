import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryForm } from "@/components/dashboard/categories/form";

async function getCategoryById(categoryId: string) {
	"use cache";
	cacheLife("days");
	cacheTag(`category-${categoryId}`);

	const category = await db.category.findUnique({ where: { id: categoryId } });

	if (!category) return notFound();

	return category;
}

export default function DashboardCategoryIdPage({ params }: PageProps<"/dashboard/categories/[categoryId]">) {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-xl/9 font-semibold">Edit Category</h1>
			</div>
			<Suspense fallback={<CategoryFormSkeleton />}>
				<CategoryFormContent params={params} />
			</Suspense>
		</>
	);
}

async function CategoryFormContent({ params }: { params: Promise<{ categoryId: string }> }) {
	const { categoryId } = await params;
	const category = await getCategoryById(categoryId);

	return <CategoryForm defaultValues={{ name: category.name, slug: category.slug }} categoryId={categoryId} />;
}

function CategoryFormSkeleton() {
	return (
		<div className="grid w-full gap-4 md:grid-cols-3">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<div />
			<Skeleton className="h-9 w-20" />
		</div>
	);
}
