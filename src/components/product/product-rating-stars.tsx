import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps extends React.PropsWithChildren {
	rating: number;
	className?: string;
	size?: "sm" | "md" | "lg";
}

const sizeClasses = {
	sm: "size-2",
	md: "size-3",
	lg: "size-4.5"
};

export function ProductRatingStars({ rating, size = "md", className, children }: StarRatingProps) {
	const clampedRating = Math.max(0, Math.min(rating, 5));

	const renderStar = (index: number) => {
		const fillPercentage = Math.max(0, Math.min(1, clampedRating - index));
		return (
			<div key={index} className="relative">
				<Star className={cn(sizeClasses[size])} />
				{fillPercentage > 0 && (
					<div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
						<Star className={cn(sizeClasses[size])} fill="currentColor" strokeWidth={1} />
					</div>
				)}
			</div>
		);
	};

	return (
		<div className={cn("*:text-muted-foreground flex items-center justify-start gap-2", className)}>
			<div className="flex items-center gap-px">{Array.from({ length: 5 }, (_, index) => renderStar(index))}</div>
			{children}
		</div>
	);
}
