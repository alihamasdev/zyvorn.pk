"use client";

import { useTransition } from "react";

import { Button, LoaderButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { deleteCategoryAction } from "./action";

interface DeleteCategoryProps extends React.ComponentProps<typeof Dialog> {
	id: number;
	category: string;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteCategory({ id, category, setOpen, ...props }: DeleteCategoryProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () =>
		startTransition(async () => {
			await deleteCategoryAction(id);
			setOpen(false);
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
