import { clsx, type ClassValue } from "clsx";
import { createLoader, parseAsString } from "nuqs/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const productIdLoader = createLoader({
	productId: parseAsString.withOptions({ shallow: false })
});
