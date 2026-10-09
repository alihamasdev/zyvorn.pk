"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import type { Category, PRODUCT_STATUS } from "@/lib/prisma/client";
import { formatSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelSelect } from "@/components/ui/floating-label-select";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TextEditor } from "@/components/ui/text-editor";
import { productSchema, type ProductSchema } from "@/components/dashboard/products/schema";
import { ImageUpload, uploadPendingImageFiles } from "@/components/image-upload";

import { upsertProductAction } from "./action";

type ProductFormProps = {
	defaultValues: ProductSchema;
	categories: Category[];
	productId?: string;
};

export function ProductForm({ defaultValues, productId, categories }: ProductFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isUploading, setIsUploading] = useState(false);
	const [statusText, setStatusText] = useState<string | null>(null);

	const initialImagesRef = useRef(defaultValues.images || []);

	const form = useForm({
		defaultValues,
		validators: { onSubmit: productSchema },
		onSubmit: ({ value }) => {
			startTransition(async () => {
				try {
					setIsUploading(true);

					// Upload any staged files on submit
					let finalImages = value.images;
					const hasStagedFiles = value.images.some((img) => img.file);

					if (hasStagedFiles) {
						setStatusText("Uploading images...");
						finalImages = await uploadPendingImageFiles(value.images, {
							folder: "/products",
							onProgress: (current, total) => {
								setStatusText(`Uploading image ${current}/${total}...`);
							},
						});
					}

					setStatusText(productId ? "Updating product..." : "Creating product...");

					// Track any existing images that were deleted
					const remainingFileIds = new Set(finalImages.map((img) => img.fileId).filter(Boolean));
					const initialFileIds = initialImagesRef.current.map((img) => img.fileId).filter(Boolean) as string[];
					const deletedImageFileIds = initialFileIds.filter((fid) => !remainingFileIds.has(fid));

					const { error } = await upsertProductAction(
						{
							...value,
							images: finalImages,
							deletedImageFileIds,
						},
						productId,
					);

					if (error) {
						toast.error(error);
						setIsUploading(false);
						setStatusText(null);
						return;
					}

					form.reset();
					toast.success(productId ? "Product updated successfully" : "New Product has been created");
					router.push("/dashboard/products");
				} catch (error) {
					console.error("Error submitting product:", error);
					toast.error("Failed to upload images or save product. Please try again.");
					setIsUploading(false);
					setStatusText(null);
				}
			});
		},
	});

	const isBusy = isPending || isUploading;

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
								value={field.state.value}
								onChange={(images) => field.handleChange(images)}
								enableCrop={true}
								cropAspectRatio={1}
								folder="/products"
								requiredDimensions={{
									width: 1080,
									height: 1080,
									label: "1080 × 1080px (1:1)",
								}}
								cardClassName="size-44"
								maxFiles={4}
								showCoverBadge={true}
								allowReorder={true}
								disabled={isBusy}
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

			<Button type="submit" disabled={isBusy}>
				{isBusy ? (
					<div className="flex items-center gap-2">
						<Spinner />
						<span>{statusText || (productId ? "Updating..." : "Creating...")}</span>
					</div>
				) : productId ? (
					"Update"
				) : (
					"Create"
				)}
			</Button>
		</form>
	);
}
