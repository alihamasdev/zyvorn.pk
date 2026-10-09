"use client";

import { useId, useRef, useState } from "react";
import { upload } from "@imagekit/next";
import { ExpandIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { imageAuth } from "@/lib/auth/image-kit";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type ProductImageSchema } from "@/components/dashboard/products/schema";
import { ImageCropperDialog } from "@/components/image-cropper-dialog";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import { ProductImage } from "@/components/product/product-image";

type ImageUploadProps = {
	id?: string;
	name?: string;
	value?: ProductImageSchema[];
	onChange?: (value: ProductImageSchema[]) => void;
	onDeleteExisting?: (fileId: string) => void;
	/** Whether cropping is enabled (e.g. true for products, false for reviews) */
	enableCrop?: boolean;
	/** Aspect ratio for cropper @default 1/1 */
	cropAspectRatio?: number;
	/** Destination folder in ImageKit (e.g. "/products" or "/reviews") */
	folder?: string;
	/** Pre/post transformations to apply on upload */
	transformation?: {
		pre?: string;
		post?: Array<{ type: "transformation"; value: string }>;
	};
	/** Maximum allowed files (default 4) */
	maxFiles?: number;
	/** Maximum file size in bytes (default 5MB) */
	maxSize?: number;
	/** Card dimension classes (default "size-44" = 176px x 176px) */
	cardClassName?: string;
	/** Custom dropzone prompt text */
	dropzoneText?: {
		title?: string;
		subtitle?: string;
	};
	className?: string;
	disabled?: boolean;
};

type CropQueueItem = {
	file: File;
	previewUrl: string;
	replaceIndex?: number;
};

type ActiveCropState = {
	imageSrc: string;
	fileName: string;
	replaceIndex?: number;
	file?: File;
	isExistingItem?: boolean;
	existingItemIndex?: number;
	queueCurrent?: number;
	queueTotal?: number;
};

export async function uploadPendingImageFiles(
	images: ProductImageSchema[],
	options?: {
		folder?: string;
		transformation?: {
			pre?: string;
			post?: Array<{ type: "transformation"; value: string }>;
		};
		onProgress?: (uploaded: number, total: number) => void;
	},
): Promise<ProductImageSchema[]> {
	const folder = options?.folder ?? "/products";

	const effectiveTransformation = options?.transformation ?? {
		pre: "w-1080,h-1080,c-maintain_ratio",
		post: [
			{ type: "transformation", value: "n-listing" },
			{ type: "transformation", value: "n-thumbnail" },
		],
	};

	const endpoint = (process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT || "https://ik.imagekit.io/zyvornpk").replace(/\/$/, "");

	const results: ProductImageSchema[] = [];
	const pendingCount = images.filter((img) => img.file).length;
	let currentPending = 0;

	for (let i = 0; i < images.length; i++) {
		const img = images[i];
		if (!img.file) {
			results.push({ ...img, order: i });
			continue;
		}

		currentPending++;
		options?.onProgress?.(currentPending, pendingCount);

		const authParams = await imageAuth("product");
		const cleanName = img.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const fileName = `${Date.now()}_${cleanName}`;

		const res = await upload({
			...authParams,
			folder,
			transformation: effectiveTransformation,
			file: img.file,
			fileName,
		});

		const filePath = res.filePath;
		if (!filePath) throw new Error("No file path returned from ImageKit");

		if (img.previewUrl) {
			URL.revokeObjectURL(img.previewUrl);
		}

		const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
		const masterUrl = res.url || `${endpoint}${cleanPath}`;
		const thumbnailUrl = `${endpoint}/tr:n-thumbnail${cleanPath}`;
		const listingUrl = `${endpoint}/tr:n-listing${cleanPath}`;

		results.push({
			id: img.id,
			fileId: res.fileId || null,
			name: res.name || img.name,
			filePath: cleanPath,
			url: masterUrl,
			thumbnailUrl,
			listingUrl,
			width: res.width ?? null,
			height: res.height ?? null,
			size: res.size ?? (img.file as File).size,
			order: i,
		});
	}

	return results;
}

export function ImageUpload({
	id,
	name,
	value = [],
	onChange,
	onDeleteExisting,
	enableCrop = false,
	cropAspectRatio = 1 / 1,
	maxFiles = 4,
	maxSize = 5 * 1024 * 1024,
	cardClassName = "size-44",
	dropzoneText,
	className,
	disabled = false,
}: ImageUploadProps) {
	const defaultId = useId();
	const inputId = id || defaultId;

	const [isDragging, setIsDragging] = useState(false);

	// Big preview modal state
	const [previewIndex, setPreviewIndex] = useState<number | null>(null);

	// Cropper modal state
	const [activeCrop, setActiveCrop] = useState<ActiveCropState | null>(null);

	const cropQueueRef = useRef<CropQueueItem[]>([]);
	const currentQueueTotalRef = useRef(0);
	const currentQueueProgressRef = useRef(0);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const images = Array.isArray(value) ? value : [];
	const canAddMore = images.length < maxFiles;

	const validateFile = (file: File): string | null => {
		if (!file.type.startsWith("image/")) {
			return `"${file.name}" is not an image file.`;
		}
		if (file.size > maxSize) {
			const sizeMb = (maxSize / (1024 * 1024)).toFixed(0);
			return `"${file.name}" exceeds the ${sizeMb}MB limit.`;
		}
		return null;
	};

	const startNextCropInQueue = (_currentImages: ProductImageSchema[]) => {
		if (cropQueueRef.current.length === 0) {
			setActiveCrop(null);
			currentQueueTotalRef.current = 0;
			currentQueueProgressRef.current = 0;
			return;
		}

		currentQueueProgressRef.current += 1;
		const nextItem = cropQueueRef.current.shift()!;

		setActiveCrop({
			imageSrc: nextItem.previewUrl,
			fileName: nextItem.file.name,
			file: nextItem.file,
			replaceIndex: nextItem.replaceIndex,
			queueCurrent: currentQueueProgressRef.current,
			queueTotal: currentQueueTotalRef.current,
		});
	};

	const stageFiles = (files: File[]) => {
		if (disabled) return;

		let filesToStage = Array.from(files);

		const remainingSlots = maxFiles - images.length;
		if (remainingSlots <= 0) {
			toast.error(`You can only have up to ${maxFiles} images.`);
			return;
		}
		if (filesToStage.length > remainingSlots) {
			toast.warning(`Only ${remainingSlots} more image(s) allowed. Processing first ${remainingSlots}.`);
			filesToStage = filesToStage.slice(0, remainingSlots);
		}

		const validFiles: File[] = [];
		for (const file of filesToStage) {
			const error = validateFile(file);
			if (error) {
				toast.error(error);
			} else {
				validFiles.push(file);
			}
		}

		if (!validFiles.length) return;

		// If cropping is NOT enabled (e.g. for review images), stage files immediately without cropper
		if (!enableCrop) {
			const newItems: ProductImageSchema[] = validFiles.map((file, idx) => {
				const previewUrl = URL.createObjectURL(file);
				return {
					name: file.name,
					file,
					previewUrl,
					filePath: "",
					url: previewUrl,
					size: file.size,
					order: images.length + idx,
				};
			});
			onChange?.([...images, ...newItems]);
			return;
		}

		// When cropping IS enabled (e.g. product images), open cropper first
		const queue: CropQueueItem[] = validFiles.map((file) => ({
			file,
			previewUrl: URL.createObjectURL(file),
		}));

		cropQueueRef.current = queue;
		currentQueueTotalRef.current = queue.length;
		currentQueueProgressRef.current = 0;

		startNextCropInQueue(images);
	};

	const handleCropComplete = (croppedResult: { file: File; previewUrl: string }) => {
		if (!activeCrop) return;

		const currentImages = [...images];

		if (activeCrop.isExistingItem && activeCrop.existingItemIndex !== undefined) {
			// Re-cropping an existing card
			const targetIdx = activeCrop.existingItemIndex;
			const oldItem = currentImages[targetIdx];
			if (oldItem?.previewUrl) {
				URL.revokeObjectURL(oldItem.previewUrl);
			}
			if (oldItem?.fileId) {
				onDeleteExisting?.(oldItem.fileId);
			}

			currentImages[targetIdx] = {
				name: croppedResult.file.name,
				file: croppedResult.file,
				previewUrl: croppedResult.previewUrl,
				filePath: "",
				url: croppedResult.previewUrl,
				size: croppedResult.file.size,
				order: targetIdx,
			};
			onChange?.(currentImages);
			setActiveCrop(null);
			toast.success("Image cropped");
			return;
		}

		// Adding new cropped image
		const newItem: ProductImageSchema = {
			name: croppedResult.file.name,
			file: croppedResult.file,
			previewUrl: croppedResult.previewUrl,
			filePath: "",
			url: croppedResult.previewUrl,
			size: croppedResult.file.size,
			order: currentImages.length,
		};
		currentImages.push(newItem);
		onChange?.(currentImages);

		// Proceed to next image in crop queue if any
		startNextCropInQueue(currentImages);
	};

	const handleCancelCrop = () => {
		if (activeCrop?.file && activeCrop.imageSrc) {
			URL.revokeObjectURL(activeCrop.imageSrc);
		}
		// Move to next in queue if any, or finish
		startNextCropInQueue(images);
	};

	const handleOpenCropperForCard = (index: number) => {
		const item = images[index];
		if (!item) return;

		const imageSrc = item.previewUrl || item.filePath || item.url;
		if (!imageSrc) return;

		setActiveCrop({
			imageSrc,
			fileName: item.name,
			isExistingItem: true,
			existingItemIndex: index,
		});
		setPreviewIndex(null);
	};

	const handleDelete = (index: number) => {
		if (disabled) return;
		const itemToDelete = images[index];

		if (itemToDelete?.previewUrl) {
			URL.revokeObjectURL(itemToDelete.previewUrl);
		}
		if (itemToDelete?.fileId) {
			onDeleteExisting?.(itemToDelete.fileId);
		}

		const nextImages = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
		onChange?.(nextImages);
		toast.info("Image removed");
	};

	const handleDeleteFromPreview = (index: number) => {
		handleDelete(index);
		if (images.length <= 1) {
			setPreviewIndex(null);
		} else if (index >= images.length - 1) {
			setPreviewIndex(images.length - 2);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!disabled && canAddMore) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (disabled) return;

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			stageFiles(Array.from(e.dataTransfer.files));
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			stageFiles(Array.from(e.target.files));
		}
		e.target.value = "";
	};

	const hasImages = images.length > 0;
	const sizeMb = (maxSize / (1024 * 1024)).toFixed(0);

	return (
		<div className="w-full space-y-2">
			<input
				id={inputId}
				name={name}
				ref={fileInputRef}
				type="file"
				className="sr-only"
				accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
				onChange={handleFileInputChange}
				disabled={disabled || !canAddMore}
				multiple
			/>

			{!hasImages ? (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={() => !disabled && fileInputRef.current?.click()}
					className={cn(
						"border-muted-foreground/25 flex min-h-50 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-all",
						isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "hover:border-primary/50 hover:bg-muted/30",
						disabled && "cursor-not-allowed opacity-60",
					)}
				>
					<div className="bg-muted/30 border-border text-muted-foreground flex size-12 items-center justify-center rounded-full border shadow-xs">
						<ImagePlusIcon size={16} />
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium">{dropzoneText?.title ?? "Drop images here or click to browse"}</p>
						<p className="text-muted-foreground text-xs">
							{dropzoneText?.subtitle ?? `PNG, JPG, WEBP up to ${sizeMb}MB (max ${maxFiles} images)`}
						</p>
					</div>
				</div>
			) : (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={cn(
						"flex flex-wrap items-center gap-4 rounded-lg p-1 transition-colors",
						isDragging && "bg-primary/5 ring-primary ring-dashed ring-2",
						className,
					)}
				>
					{images.map((item, index) => {
						const isPending = Boolean(item.file);
						const displaySrc = item.previewUrl || item.filePath || item.url;

						return (
							<div
								key={`${item.name}-${index}`}
								onClick={() => setPreviewIndex(index)}
								className={cn("group relative shrink-0 cursor-pointer rounded-lg transition-transform", cardClassName)}
							>
								<div className="bg-muted/30 border-border relative size-full overflow-hidden rounded-lg border shadow-xs">
									{isPending ? (
										<img src={displaySrc} alt={item.name} className="size-full object-cover" />
									) : (
										<ProductImage
											src={item.filePath || item.url}
											alt={`Image ${index + 1}`}
											transformation="thumbnail"
											className="size-full object-cover"
											size={180}
										/>
									)}

									{/* Center Expand Icon on Hover */}
									<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<div className="flex items-center justify-center text-white transition-transform duration-300">
											<ExpandIcon size={24} />
										</div>
									</div>
								</div>

								<Button
									type="button"
									size="icon"
									variant="destructive"
									className="absolute -top-2 -right-2 z-20 size-6.5 cursor-pointer rounded-full opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(index);
									}}
								>
									<XIcon size={14} />
								</Button>
							</div>
						);
					})}

					{canAddMore && (
						<button
							type="button"
							onClick={() => !disabled && fileInputRef.current?.click()}
							className={cn(
								"border-muted-foreground/25 hover:border-primary/50 text-muted-foreground flex shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-all disabled:cursor-not-allowed disabled:opacity-60",
								cardClassName,
							)}
							disabled={disabled}
						>
							<ImagePlusIcon size={18} />
							<span className="text-xs font-medium">Add Image</span>
						</button>
					)}
				</div>
			)}

			<ImagePreviewDialog
				open={previewIndex !== null}
				images={images}
				currentIndex={previewIndex ?? 0}
				enableCrop={enableCrop}
				onClose={() => setPreviewIndex(null)}
				onIndexChange={(idx) => setPreviewIndex(idx)}
				onCropClick={handleOpenCropperForCard}
				onDelete={handleDeleteFromPreview}
			/>

			<ImageCropperDialog
				open={activeCrop !== null}
				imageSrc={activeCrop?.imageSrc ?? null}
				fileName={activeCrop?.fileName}
				aspectRatio={cropAspectRatio}
				queueInfo={
					activeCrop?.queueTotal && activeCrop.queueTotal > 1
						? { current: activeCrop.queueCurrent ?? 1, total: activeCrop.queueTotal }
						: undefined
				}
				onClose={handleCancelCrop}
				onCropComplete={handleCropComplete}
			/>
		</div>
	);
}
