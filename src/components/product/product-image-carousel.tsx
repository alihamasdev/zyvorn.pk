"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { ProductImage } from "@/components/product/product-image";

export function ProductImageCarousel({ images, title, stock }: { images: string[]; title: string; stock: number }) {
	const [current, setCurrent] = useState(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
	}, [api]);

	return (
		<div className="space-y-2">
			<Carousel setApi={setApi} className="bg-muted overflow-hidden rounded-lg border">
				<CarouselContent className="m-0">
					{images.map((src, index) => (
						<CarouselItem
							key={index}
							className={cn("overflow-hidden p-0", index === 0 && "rounded-l-lg", index === images.length - 1 && "rounded-r-lg")}
						>
							<div className="bg-muted shrink-0 overflow-hidden">
								<ProductImage
									src={src}
									size={600}
									alt={title}
									transformation="default"
									loading={index === 0 ? "eager" : "lazy"}
									priority={index === 0}
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				{!stock && <Badge className="absolute top-4 right-4 px-3 py-1 text-sm">Sold Out</Badge>}
				<CarouselNext className="right-4 hidden md:inline-flex" variant="default" />
				<CarouselPrevious className="left-4 hidden md:inline-flex" variant="default" />
			</Carousel>
			<div className="grid grid-cols-4 gap-2">
				{images.map((src, index) => (
					<button
						type="button"
						key={src + index}
						onClick={() => api?.scrollTo(index)}
						aria-label={`View image ${index + 1} of ${title}`}
						className={cn(
							"cursor-pointer overflow-hidden transition-opacity duration-300 hover:opacity-100",
							index + 1 === current ? "opacity-100" : "opacity-50",
						)}
					>
						<ProductImage src={src} size={150} alt="" transformation="thumbnail" loading="eager" priority />
					</button>
				))}
			</div>
		</div>
	);
}
