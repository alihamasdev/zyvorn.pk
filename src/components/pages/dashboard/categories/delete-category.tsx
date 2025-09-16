"use client";

import { useTransition } from "react";
import type { Category } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button, LoaderButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { deleteCategoryAction } from "./action";

interface DeleteCategoryProps extends React.ComponentProps<typeof Dialog> {
	id: number;
	category: string;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteCategory({ id, category, setOpen, ...props }: DeleteCategoryProps) {
	const queryClient = useQueryClient();
	const [isPending, startTransition] = useTransition();

	const handleDelete = () =>
		startTransition(async () => {
			const { error } = await deleteCategoryAction(id);
			if (error) {
				toast.error(error);
			} else {
				setOpen(false);
				queryClient.setQueryData(["categories", "dashboard"], (oldData: Category[]) => oldData.filter((val) => val.id !== id));
			}
		});

	return (
		<Dialog onOpenChange={setOpen} {...props}>
			<DialogContent className="max-w-75 sm:max-w-sm">
				<DialogHeader>
					<DialogTitle className="capitalize">Permanently Delete {category}?</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					You're about to delete "{category}". This will remove the category and all related products from store. Please confirm or cancel
					to keep the category.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<LoaderButton variant="destructive" loadingText="Deleting" onClick={handleDelete} loading={isPending}>
						Confirm
					</LoaderButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
