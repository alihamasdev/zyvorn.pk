"use client";

import { useState } from "react";

import { useCategories } from "@/context/categories-context";
import { CategoryCard } from "@/components/pages/dashboard/categories/category-card";
import { CategoriesForm } from "@/components/pages/dashboard/categories/form";

export default function CategoriesPage() {
	const categories = useCategories();
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl/9 font-semibold">Categories</h1>
				<CategoriesForm title="Add Category" defaultValues={{ name: "", slug: "", id: undefined }} open={open} setOpen={setOpen} trigger />
			</div>
			<section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
				{categories.map((data) => (
					<CategoryCard key={data.slug} {...data} />
				))}
			</section>
		</div>
	);
}
