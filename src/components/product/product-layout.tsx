import type { UseQueryResult } from "@tanstack/react-query";

import type { ProductPayload } from "@/lib/types";
import { calculateRating } from "@/lib/utils";
import { ErrorComp } from "@/components/ui/error";
import { ProductCard, ProductCardLoader } from "@/components/product/product-card";

interface ProductLayoutProps extends React.PropsWithChildren {
	query: UseQueryResult<ProductPayload[], Error>;
}

export function ProductLayout({ query }: ProductLayoutProps) {
	const { data, status } = query;

	if (status === "pending") {
		return (
			<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				<ProductCardLoader />
			</div>
		);
	}

	if (status === "error") {
		return <ErrorComp />;
	}

	return (
		<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{data.map((product) => (
				<ProductCard key={product.id} productData={{ ...product, rating: calculateRating(product.reviews) }} />
			))}
		</div>
	);
}
