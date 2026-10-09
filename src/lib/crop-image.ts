export type PixelCrop = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});
}

function calculateRotatedSize(width: number, height: number, rotation: number) {
	const rotRad = (rotation * Math.PI) / 180;
	return {
		width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
		height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
	};
}

export async function getCroppedImg(
	imageSrc: string,
	pixelCrop: PixelCrop,
	rotation = 0,
	fileName = "cropped.webp",
	outputType = "image/webp",
	quality = 0.95,
): Promise<{ file: File; previewUrl: string }> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Unable to create canvas 2D context");
	}

	const rotRad = (rotation * Math.PI) / 180;
	const { width: bBoxWidth, height: bBoxHeight } = calculateRotatedSize(image.width, image.height, rotation);

	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.translate(-image.width / 2, -image.height / 2);

	ctx.drawImage(image, 0, 0);

	const croppedCanvas = document.createElement("canvas");
	const croppedCtx = croppedCanvas.getContext("2d");

	if (!croppedCtx) {
		throw new Error("Unable to create cropped canvas 2D context");
	}

	croppedCanvas.width = pixelCrop.width;
	croppedCanvas.height = pixelCrop.height;

	croppedCtx.drawImage(canvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

	return new Promise((resolve, reject) => {
		croppedCanvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error("Canvas toBlob failed"));
					return;
				}
				const file = new File([blob], fileName, { type: outputType });
				const previewUrl = URL.createObjectURL(file);
				resolve({ file, previewUrl });
			},
			outputType,
			quality,
		);
	});
}
