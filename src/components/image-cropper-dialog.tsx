"use client";

import { useState, useTransition } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

import { getCroppedImg, type PixelCrop } from "@/lib/crop-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ImageCropperDialogProps = {
	open: boolean;
	imageSrc: string | null;
	fileName?: string;
	aspectRatio?: number;
	queueInfo?: { current: number; total: number };
	onClose: () => void;
	onCropComplete: (result: { file: File; previewUrl: string }) => void;
};

export function ImageCropperDialog({
	open,
	imageSrc,
	fileName = "image.webp",
	aspectRatio = 1,
	queueInfo,
	onClose,
	onCropComplete,
}: ImageCropperDialogProps) {
	const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

	const [isProcessing, startProcessing] = useTransition();

	const handleApplyCrop = () =>
		startProcessing(async () => {
			if (!imageSrc || !croppedAreaPixels) return;
			try {
				const cleanBaseName = fileName.replace(/\.[^/.]+$/, "");
				const croppedFileName = `${cleanBaseName}_cropped.webp`;

				const result = await getCroppedImg(imageSrc, croppedAreaPixels, 0, croppedFileName);

				onCropComplete(result);
			} catch (error) {
				console.error("Error cropping image:", error);
				toast.error("Failed to crop image. Please try again.");
			}
		});

	const titleText = queueInfo && queueInfo.total > 1 ? `Crop Image (${queueInfo.current} of ${queueInfo.total})` : "Crop Image";

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isProcessing && onClose()}>
			<DialogContent showCloseButton={!isProcessing}>
				<DialogHeader>
					<DialogTitle>{titleText}</DialogTitle>
					<DialogDescription>Drag and zoom to select which part of the image to keep.</DialogDescription>
				</DialogHeader>

				<div className="relative h-80 w-full overflow-hidden rounded-md sm:h-96 md:h-100">
					{imageSrc && (
						<Cropper
							image={imageSrc}
							showGrid={true}
							aspect={aspectRatio}
							crop={crop}
							onCropChange={(newCrop) => setCrop(newCrop)}
							onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
						/>
					)}
				</div>

				<DialogFooter className="flex-row justify-end">
					<Button type="button" variant="outline" disabled={isProcessing} onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" disabled={isProcessing || !croppedAreaPixels} onClick={handleApplyCrop}>
						Crop
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
