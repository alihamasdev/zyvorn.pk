"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Category } from "@/lib/prisma/client";
import { optimisticUpdate } from "@/lib/tanstack/optimistic-update";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { deleteCategoryAction } from "./action";

interface DeleteCategoryProps extends React.ComponentProps<typeof Dialog> {
	id: number;
	category: string;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CategoryDeleteDialog({ id, category, setOpen, ...props }: DeleteCategoryProps) {
	const queryClient = useQueryClient();

	const queryKey: QueryKey = ["categories", "dashboard"];

	const { mutate } = useMutation({
		mutationFn: deleteCategoryAction,
		onMutate: async () => {
			const [previousData] = await optimisticUpdate<Category[]>(queryKey, (oldData) => oldData?.filter((val) => val.id !== id));
			setOpen(false);
			return previousData;
		},
		onError: (error, _variables, context) => {
			toast.error(error.message);
			queryClient.setQueryData<Category[]>(queryKey, context);
		},
		onSuccess: () => toast.success("Category deleted successfuly")
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
					<Button variant="destructive" onClick={() => mutate(id)}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
