import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calculateRating(rating: { rating: number }[]) {
	const totalRatings = rating.length;
	const { rating: ratingSum } = rating.reduce((acc, curr) => ({ rating: acc.rating + curr.rating }), { rating: 0 });
	const averageRating = totalRatings === 0 ? 0 : ratingSum / totalRatings;
	return Number(averageRating.toFixed(1));
}
