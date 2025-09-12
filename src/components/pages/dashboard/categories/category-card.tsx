"use client";

import { use, useState } from "react";
import type { Category } from "@prisma/client";
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DeleteCategory } from "./delete-category";
import { CategoriesForm } from "./form";

export function CategoryList({ dataPromise }: { dataPromise: Promise<Category[]> }) {
	const categories = use(dataPromise);
	const [open, setOpen] = useState(false);

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl/9 font-semibold">Categories</h1>
				<CategoriesForm title="Add Category" defaultValues={{ name: "", slug: "", id: undefined }} open={open} setOpen={setOpen} trigger />
			</div>
			<section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
				{categories.map((data) => {
					return <CategoryCard key={data.slug} {...data} />;
				})}
			</section>
		</div>
	);
}

function CategoryCard({ id, name, slug }: Category) {
	const [open, setOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<Card key={slug} className="relative gap-4">
			<CardHeader className="items-center">
				<CardTitle className="capitalize">{name}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription>{slug}</CardDescription>
			</CardContent>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className="absolute top-3 right-3 size-7">
						<EllipsisVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<EditIcon />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
						<Trash2Icon />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
				<CategoriesForm title="Edit Category" defaultValues={{ name, slug, id }} open={open} setOpen={setOpen} />
				<DeleteCategory id={id} category={name} open={deleteOpen} setOpen={setDeleteOpen} />
			</DropdownMenu>
		</Card>
	);
}
