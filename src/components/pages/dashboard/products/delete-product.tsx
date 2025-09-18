import { useState } from "react";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { optimisticUpdate } from "@/lib/tanstack/optimistic-update";
import type { ProductPayload } from "@/lib/types";
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
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const queryKey: QueryKey = ["products", "dashboard"];

	const { mutate } = useMutation({
		mutationFn: deleteProductAction,
		onMutate: async () => {
			const [previousData] = await optimisticUpdate<ProductPayload[]>(queryKey, (oldData) => oldData?.filter((val) => val.slug !== slug));
			return previousData;
		},
		onError: (error, _variables, context) => {
			toast.error(error.message);
			queryClient.setQueryData<ProductPayload[]>(queryKey, context);
		},
		onSuccess: () => toast.success("Product deleted successfully")
	});

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
					<Button variant="destructive" onClick={() => mutate(slug)}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
