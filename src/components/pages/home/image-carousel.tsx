"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

type CarouselImage = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
};

interface ImageCarouselProps extends React.ComponentProps<"section"> {
	images: CarouselImage[];
	autoPlay?: boolean;
	autoPlayInterval?: number;
}

export function ImageCarousel({ images, autoPlay = true, autoPlayInterval = 5000, ...props }: ImageCarouselProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) return;

		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	useEffect(() => {
		if (!api) return;
		if (!autoPlay) return;

		const interval = setInterval(() => {
			api.scrollNext();
		}, autoPlayInterval);

		return () => clearInterval(interval);
	}, [api, autoPlay, autoPlayInterval]);

	if (!images.length) return null;

	return (
		<section {...props}>
			<Carousel opts={{ loop: true }} setApi={setApi} className="overflow-hidden rounded-2xl">
				<CarouselContent className="m-0">
					{images.map(({ src, alt, width, height }, index) => (
						<CarouselItem key={index} className="bg-muted w-full p-0">
							<img src={src} alt={alt} width={width} height={height} className="w-full object-cover" loading="eager" />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<div className="mt-4 flex items-center justify-center gap-2">
				{Array.from({ length: images.length }, (_, index) => (
					<button
						key={index}
						type="button"
						onClick={() => api?.scrollTo(index)}
						aria-label={`Go to slide ${index + 1}`}
						className={cn(
							"size-2 rounded-full transition-all duration-200",
							index + 1 === current ? "bg-primary" : "bg-muted-foreground/30"
						)}
					/>
				))}
			</div>
		</section>
	);
}
