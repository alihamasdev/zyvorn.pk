import { format } from "date-fns";
import slugify from "slugify";

export { cn } from "cn";

export function formatDate(date: string | Date) {
	return format(date, "MMM dd, yyyy");
}

export function formatSlug(value: string) {
	return slugify(value, { lower: true, trim: true });
}

export function formatPrice(price: number) {
	return new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(price);
}

export function getProductImageUrl(src?: string | null): string {
	if (!src) return "";
	if (src.startsWith("http://") || src.startsWith("https://")) {
		return src;
	}
	const endpoint = (process.env.IMAGE_KIT_URL_ENDPOINT || "https://ik.imagekit.io/zyvornpk").replace(/\/$/, "");
	const cleanPath = src.startsWith("/") ? src : `/${src}`;
	const separator = cleanPath.includes("?") ? "&" : "?";
	return `${endpoint}${cleanPath}${separator}tr=w-120,h-120`;
}
