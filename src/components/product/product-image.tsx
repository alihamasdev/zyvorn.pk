import { Image, type IKImageProps } from "@imagekit/next";

import { cn } from "@/lib/utils";

type ImageSource =
	string | { filePath?: string | null; url?: string | null; thumbnailUrl?: string | null; listingUrl?: string | null } | null | undefined;

type ProductImageProps = Omit<IKImageProps, "transformation" | "src"> & {
	src?: ImageSource;
	size: number;
	transformation?: "listing" | "thumbnail" | "default";
};

export function ProductImage({ src, size, transformation = "default", className, ...props }: ProductImageProps) {
	let resolvedSrc = "";

	if (typeof src === "string") {
		resolvedSrc = src;
	} else if (src && typeof src === "object") {
		resolvedSrc = src.filePath || src.url || "";
	}

	if (!resolvedSrc) {
		return <div className={cn("bg-muted/60 text-muted-foreground flex aspect-square size-full items-center justify-center", className)} />;
	}

	return (
		<Image
			src={resolvedSrc}
			width={size}
			height={size}
			className={cn("aspect-square size-full object-cover", className)}
			transformation={[{ named: transformation }]}
			{...props}
		/>
	);
}
