"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import type { Category, PRODUCT_STATUS } from "@/lib/prisma/client";
import { formatSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelSelect } from "@/components/ui/floating-label-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TextEditor } from "@/components/ui/text-editor";
import { productSchema, type ProductSchema } from "@/components/dashboard/products/schema";
import { ImageUpload } from "@/components/image-upload";

import { upsertProductAction } from "./action";

type ProductFormProps = {
	defaultValues: ProductSchema;
	categories: Category[];
	productId?: string;
};

export function ProductForm({ defaultValues, productId, categories }: ProductFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [imagePending, imageTransition] = useTransition();

	const form = useForm({
		defaultValues,
		validators: { onSubmit: productSchema },
		onSubmit: ({ value }) => {
			startTransition(async () => {
				const { error } = await upsertProductAction(value, productId);
				if (error) {
					toast.error(error);
					return;
				}
				form.reset();
				router.push("/dashboard/products");
				toast.success(productId ? "Product updated successfuly" : "New Product has been created");
			});
		},
	});

	return (
		<form
			className="grid w-full gap-4 lg:grid-cols-2 xl:grid-cols-3"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="title"
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
							!form.state.fieldMeta.slug?.isBlurred && form.setFieldValue("slug", formatSlug(e.target.value));
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

			<form.Field
				name="categoryId"
				children={(field) => (
					<FloatingLabelSelect
						placeholder="Category"
						name={field.name}
						value={field.state.value}
						onValueChange={(value) => field.handleChange(value)}
					>
						{categories.map(({ id, name }) => (
							<SelectItem key={id} value={id}>
								{name}
							</SelectItem>
						))}
					</FloatingLabelSelect>
				)}
			/>

			<form.Field
				name="costPrice"
				children={(field) => (
					<FloatingLabelInput
						type="number"
						placeholder="Cost Price"
						name={field.name}
						value={field.state.value || ""}
						onBlur={field.handleBlur}
						errors={field.state.meta.errors}
						isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
						onChange={(e) => field.handleChange(Number(e.target.value))}
					/>
				)}
			/>

			<form.Field
				name="salePrice"
				children={(field) => (
					<FloatingLabelInput
						type="number"
						placeholder="Sale Price"
						name={field.name}
						value={field.state.value || ""}
						onBlur={field.handleBlur}
						errors={field.state.meta.errors}
						isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
						onChange={(e) => field.handleChange(Number(e.target.value))}
					/>
				)}
			/>

			<form.Field
				name="discountPrice"
				children={(field) => (
					<FloatingLabelInput
						type="number"
						placeholder="Discount Price"
						name={field.name}
						value={field.state.value || ""}
						onBlur={field.handleBlur}
						errors={field.state.meta.errors}
						isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
						onChange={(e) => field.handleChange(Number(e.target.value))}
					/>
				)}
			/>

			<form.Field
				name="images"
				children={(field) => {
					const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
					return (
						<Field className="gap-1 lg:col-span-2 xl:col-span-3">
							<FieldLabel htmlFor={field.name}>Images</FieldLabel>
							<ImageUpload
								id={field.name}
								name={field.name}
								className="*:size-30"
								transition={imageTransition}
								pushValue={field.pushValue}
								removeValue={field.removeValue}
								uploadOptions={{
									folder: "/products",
									transformation: {
										pre: "n-default",
										post: [
											{ type: "transformation", value: "n-listing" },
											{ type: "transformation", value: "n-thumbnail" },
										],
									},
								}}
							/>
							{isInvalid && <FieldError className="text-sm" errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			/>

			<form.Field
				name="description"
				children={(field) => {
					const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
					return (
						<Field className="gap-1 lg:col-span-2 xl:col-span-3">
							<FieldLabel>Description</FieldLabel>
							<TextEditor value={field.state.value} onChange={(value) => field.handleChange(value)} />
							{isInvalid && <FieldError className="text-sm" errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			/>

			<form.Field
				name="stock"
				children={(field) => (
					<FloatingLabelInput
						type="number"
						placeholder="Stock"
						name={field.name}
						value={field.state.value || ""}
						onBlur={field.handleBlur}
						errors={field.state.meta.errors}
						isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
						onChange={(e) => field.handleChange(Number(e.target.value))}
					/>
				)}
			/>

			<form.Field
				name="status"
				children={(field) => (
					<FloatingLabelSelect
						placeholder="Status"
						name={field.name}
						value={field.state.value}
						onValueChange={(value) => field.handleChange(value as PRODUCT_STATUS)}
					>
						<SelectItem value="PUBLISHED">Published</SelectItem>
						<SelectItem value="DRAFT">Draft</SelectItem>
						<SelectItem value="ARCHIVED">Archived</SelectItem>
					</FloatingLabelSelect>
				)}
			/>

			<div />

			<Button type="submit" disabled={imagePending || isPending}>
				{isPending || imagePending ? <Spinner /> : productId ? "Update" : "Create"}
			</Button>
		</form>
	);
}
