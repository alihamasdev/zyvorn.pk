"use client";

import { useEffect, useState } from "react";
import { Image } from "@imagekit/next";

import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

type ImageCarouselProps = React.ComponentProps<"section"> & {
	autoPlay?: boolean;
	autoPlayInterval?: number;
};

export function ImageCarousel({ autoPlay = true, autoPlayInterval = 5000, ...props }: ImageCarouselProps) {
	const images = ["banners/banner_1.webp", "banners/banner_2.webp", "banners/banner_3.webp"];

	const [current, setCurrent] = useState(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;

		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
	}, [api]);

	useEffect(() => {
		if (!api || !autoPlay) return;

		const interval = setInterval(() => api.scrollNext(), autoPlayInterval);

		return () => clearInterval(interval);
	}, [api, autoPlay, autoPlayInterval]);

	return (
		<section {...props}>
			<Carousel opts={{ loop: true }} setApi={setApi} className="overflow-hidden rounded-lg">
				<CarouselContent className="m-0">
					{images.map((image, index) => (
						<CarouselItem key={index} className="bg-muted w-full p-0">
							<Image
								src={image}
								alt={`banner_${index}`}
								width={1248}
								height={416}
								className="w-full object-cover"
								loading="eager"
								priority
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			{images.length > 1 && (
				<div className="flex items-center justify-center gap-2">
					{Array.from({ length: images.length }, (_, index) => (
						<button
							key={index}
							type="button"
							onClick={() => api?.scrollTo(index)}
							aria-label={`Go to slide ${index + 1}`}
							className={cn(
								"size-2 rounded-full transition-all duration-200",
								index + 1 === current ? "bg-primary" : "bg-muted-foreground/30",
							)}
						/>
					))}
				</div>
			)}
		</section>
	);
}
