"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm, type DefaultValues } from "react-hook-form";
import slugify from "slugify";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { categoryUpsertAction } from "./action";
import { categoriesSchema, type CategoriesSchema } from "./schema";

interface CategoriesFormProps extends React.ComponentProps<typeof Dialog> {
	title: string;
	trigger?: boolean;
	defaultValues?: DefaultValues<CategoriesSchema>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CategoriesForm({ defaultValues, title, trigger, setOpen, ...props }: CategoriesFormProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<CategoriesSchema>({
		resolver: zodResolver(categoriesSchema),
		defaultValues
	});

	function onSubmit(values: CategoriesSchema) {
		startTransition(async () => {
			const { error } = await categoryUpsertAction(values);
			if (error) {
				toast.error(error);
			} else {
				setOpen(false);
			}
			form.reset();
		});
	}

	return (
		<Dialog onOpenChange={setOpen} {...props}>
			{trigger && (
				<DialogTrigger asChild>
					<Button>
						<PlusIcon />
						Add Category
					</Button>
				</DialogTrigger>
			)}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Form {...form}>
					<form className="grid w-full gap-4 md:gap-6" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field: { onChange, ...field } }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											onChange={(e) => {
												form.setValue("name", e.target.value);
												form.setValue("slug", slugify(e.target.value, { trim: true, lower: true }));
											}}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<Input readOnly {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="secondary">Cancel</Button>
							</DialogClose>
							<LoaderButton type="submit" loading={isPending} />
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
