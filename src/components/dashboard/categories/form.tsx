"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { formatSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import { categorySchema, type CategorySchema } from "@/components/dashboard/categories/schema";

import { upsertCategoryAction } from "./action";

export function CategoryForm({ defaultValues, categoryId }: { defaultValues: CategorySchema; categoryId?: string }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const form = useForm({
		defaultValues,
		validators: { onSubmit: categorySchema },
		onSubmit: ({ value }) => {
			startTransition(async () => {
				const { error } = await upsertCategoryAction(value, categoryId);
				if (error) {
					toast.error(error);
					return;
				}
				form.reset();
				toast.success(categoryId ? "Category updated successfuly" : "New category has been created");
				router.push("/dashboard/categories");
			});
		},
	});

	return (
		<form
			className="grid w-full gap-4 md:grid-cols-3"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="name"
				children={(field) => (
					<FloatingLabelInput
						placeholder="Title"
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						errors={field.state.meta.errors}
						isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
						onChange={(e) => {
							field.handleChange(e.target.value);
							!form.state.fieldMeta.slug.isBlurred && form.setFieldValue("slug", formatSlug(e.target.value));
						}}
					/>
				)}
			/>

			<form.Field
				name="slug"
				children={(field) => (
					<FloatingLabelInput
						placeholder="Slug"
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						errors={field.state.meta.errors}
						isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
				)}
			/>

			<div />

			<Button type="submit" disabled={isPending}>
				{isPending ? <Spinner /> : categoryId ? "Update" : "Create"}
			</Button>
		</form>
	);
}
