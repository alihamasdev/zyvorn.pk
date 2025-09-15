import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button, LoaderButton } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";

import { deleteProductAction } from "./action";
import type { ProductPayload } from "./columns";

export function ProductDeleteDialog({ id }: { id: number }) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			const { error } = await deleteProductAction(id);
			if (error) {
				toast.error(error);
			} else {
				setOpen(false);
				queryClient.setQueryData(["products", "dashboard"], (oldData: ProductPayload[]) => oldData.filter((val) => val.id !== id));
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="destructive" className="size-7">
					<Trash2Icon className="size-3.5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Product?</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure you want to delete this product? This action cannot be undone, and the product will be permanently removed from your
					store.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<LoaderButton variant="destructive" loadingText="Deleting" loading={isPending} onClick={handleDelete}>
						Delete
					</LoaderButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
