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
