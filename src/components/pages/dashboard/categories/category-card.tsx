"use client";

import { useState } from "react";
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";

import type { Category } from "@/lib/prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { CategoryDeleteDialog } from "./delete-category";
import { CategoriesForm } from "./form";

export function CategoryCard({ id, name, slug }: Category) {
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
				<CategoryDeleteDialog id={id} category={name} open={deleteOpen} setOpen={setDeleteOpen} />
			</DropdownMenu>
		</Card>
	);
}
