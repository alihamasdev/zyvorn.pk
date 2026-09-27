"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type DeleteDialogProps = React.ComponentProps<typeof Dialog> & {
	title: string;
	description: string;
	children: React.ReactNode;
	closeOnDelete?: boolean;
	onDelete: (close: (open: boolean) => void) => Promise<void> | void;
};

export function DeleteDialog({ title, description, onDelete, closeOnDelete = true, children, ...props }: DeleteDialogProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			await onDelete(setOpen);
			closeOnDelete && setOpen(false);
		});
	};

	const handleClose = (open: boolean) => {
		if (!isPending) {
			setOpen(open);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose} {...props}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription>{description}</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={isPending}>
							Cancel
						</Button>
					</DialogClose>
					<Button variant="destructive" disabled={isPending} onClick={handleDelete}>
						{isPending && <Spinner />}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
