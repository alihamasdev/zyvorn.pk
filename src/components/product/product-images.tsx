"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

export function ProductImages({ images }: { images: string[] }) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
	}, [api]);

	if (!images.length) return null;

	return (
		<div className="grid gap-2">
			<Carousel setApi={setApi} className="bg-muted overflow-hidden rounded-lg border">
				<CarouselContent className="m-0">
					{images.map((src, index) => (
						<CarouselItem
							key={index}
							className={cn("overflow-hidden p-0", index === 0 && "rounded-l-lg", index === images.length - 1 && "rounded-r-lg")}
						>
							<Image
								src={src}
								width={400}
								height={400}
								alt={src.split("/")[1]}
								loading={index === 0 ? "eager" : "lazy"}
								className="aspect-square size-full object-cover"
								priority={index === 0}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext className="right-4 hidden md:inline-flex" variant="default" />
				<CarouselPrevious className="left-4 hidden md:inline-flex" variant="default" />
			</Carousel>
			<div className="grid grid-cols-4 gap-2">
				{images.map((src, index) => (
					<button
						key={src}
						type="button"
						onClick={() => api?.scrollTo(index)}
						className={cn(
							"bg-muted cursor-pointer overflow-hidden rounded-md border transition-[opacity] duration-300 hover:opacity-100",
							index + 1 === current ? "opacity-100" : "opacity-50"
						)}
					>
						<Image
							src={src}
							width={100}
							height={100}
							loading="eager"
							alt={src.split("/")[1]}
							className="aspect-square size-full object-cover"
							priority
						/>
					</button>
				))}
			</div>
		</div>
	);
}
