import { Image, type IKImageProps } from "@imagekit/next";

import { cn } from "@/lib/utils";

type ProductImageProps = Omit<IKImageProps, "transformation"> & {
	size: number;
	transformation?: "listing" | "thumbnail" | "default";
};

export function ProductImage({ size, transformation = "default", className, ...props }: ProductImageProps) {
	return (
		<Image
			width={size}
			height={size}
			className={cn("aspect-square size-full object-cover", className)}
			transformation={[{ named: transformation }]}
			{...props}
		/>
	);
}
