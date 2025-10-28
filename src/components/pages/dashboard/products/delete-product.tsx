import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

export function ProductDeleteDialog({ slug }: { slug: string }) {
	const [open, setOpen] = useState(false);

	const handleDelete = async () => {
		const { error } = await deleteProductAction(slug);
		if (!error) {
			setOpen(false);
			toast.success("Product Deleted successfuly");
		} else {
			toast.error("Something went wrong");
		}
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
					<Button variant="destructive" onClick={handleDelete}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
