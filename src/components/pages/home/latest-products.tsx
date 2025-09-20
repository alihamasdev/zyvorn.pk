"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import type { ProductPayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProductLayout } from "@/components/product/product-layout";

export function LatestProducts() {
	const query = useQuery({
		queryKey: ["latest", "products"],
		queryFn: () => axios.get<ProductPayload[]>("/api/products/latest").then((res) => res.data)
	});

	return (
		<>
			<ProductLayout query={query} />
			<div className="flex justify-center">
				<Button variant="outline" className="cursor-pointer" asChild>
					<Link href="/collections/all-products">Show More</Link>
				</Button>
			</div>
		</>
	);
}
