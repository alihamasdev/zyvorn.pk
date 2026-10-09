"use client";

import { useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CropIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type ProductImageSchema } from "@/components/dashboard/products/schema";
import { ProductImage } from "@/components/product/product-image";

type ImagePreviewDialogProps = {
	open: boolean;
	images: ProductImageSchema[];
	currentIndex: number;
	enableCrop?: boolean;
	onClose: () => void;
	onIndexChange: (index: number) => void;
	onCropClick?: (index: number) => void;
	onDelete?: (index: number) => void;
};

export function ImagePreviewDialog({
	open,
	images,
	currentIndex,
	enableCrop = false,
	onClose,
	onIndexChange,
	onCropClick,
	onDelete,
}: ImagePreviewDialogProps) {
	const currentItem = images[currentIndex];
	const isStaged = Boolean(currentItem?.file);
	const hasPrev = currentIndex > 0;
	const hasNext = currentIndex < images.length - 1;

	// Keyboard arrow navigation (non-looping)
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft" && currentIndex > 0) {
				onIndexChange(currentIndex - 1);
			} else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
				onIndexChange(currentIndex + 1);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, currentIndex, images.length, onIndexChange]);

	if (!images.length || currentIndex < 0 || currentIndex >= images.length || !currentItem) {
		return null;
	}

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (hasPrev) {
			onIndexChange(currentIndex - 1);
		}
	};

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (hasNext) {
			onIndexChange(currentIndex + 1);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete?.(currentIndex);
	};

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="overflow-hidden rounded-2xl border-none p-0 lg:max-w-2xl xl:max-w-4xl">
				<DialogTitle className="sr-only">Product Image Preview</DialogTitle>

				{/* Full Edge-to-Edge Image */}
				<div className="bg-muted relative size-full overflow-hidden">
					{isStaged && currentItem.previewUrl ? (
						<img src={currentItem.previewUrl} alt="" className="size-full object-cover select-none" />
					) : (
						<ProductImage
							src={currentItem.filePath || currentItem.url}
							alt=""
							size={1080}
							transformation="default"
							className="size-full object-cover select-none"
						/>
					)}

					{/* Navigation Arrows (No loop) */}
					{hasPrev && (
						<Button
							type="button"
							variant="secondary"
							size="icon"
							onClick={handlePrev}
							className="absolute top-1/2 left-3 z-30 -translate-y-1/2 rounded-full"
						>
							<ChevronLeftIcon className="size-5" />
						</Button>
					)}

					{hasNext && (
						<Button
							type="button"
							variant="secondary"
							size="icon"
							onClick={handleNext}
							className="absolute top-1/2 right-3 z-30 -translate-y-1/2 rounded-full"
						>
							<ChevronRightIcon className="size-5" />
						</Button>
					)}

					{/* Bottom Overlaid Action Bar */}
					<div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-linear-to-t from-black/80 via-black/40 to-transparent p-4">
						<div className="flex items-center gap-2">
							{enableCrop && (
								<Button type="button" variant="secondary" size="sm" onClick={() => onCropClick?.(currentIndex)}>
									<CropIcon size={16} />
									<span>Crop</span>
								</Button>
							)}

							<Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
								<Trash2Icon size={16} />
								<span>Delete</span>
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
