import { Suspense } from "react";
import { notFound } from "next/navigation";
import { StarIcon } from "lucide-react";

import { getCategoryProducts, getLatestProducts, getProductBySlug } from "@/lib/dal";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ProductButtons } from "@/components/product/product-buttons";
import { ProductCard } from "@/components/product/product-card";
import { ProductImageCarousel } from "@/components/product/product-image-carousel";

export async function generateStaticParams() {
	const products = await getLatestProducts();
	return products.map((product) => ({ slug: product.slug }));
}

export default async function StoreProductPage({ params }: PageProps<"/products/[slug]">) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) return notFound();

	return (
		<div className="space-y-10">
			<section className="container mx-auto px-4">
				<div className="grid gap-x-15 gap-y-7 md:grid-cols-2">
					<ProductImageCarousel images={product.images} title={product.title} stock={product.stock} />
					<div className="md:py-2">
						<h1 className="mb-4 text-2xl font-semibold md:text-3xl">{product.title}</h1>
						<div className="flex gap-0.5">
							{Array.from({ length: 5 }).map((_, index) => (
								<StarIcon key={index} size={18} className="text-muted-foreground" />
							))}
							<p className="text-muted-foreground ml-2 leading-4.5">No Reviews</p>
						</div>
						<p className="text-muted-foreground mt-3">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium, voluptatum illum ab ipsum, accusantium enim nam facilis
							assumenda cumque expedita veniam culpa recusandae laborum commodi quis qui dicta non repellat delectus! Ad laudantium totam
							possimus? Amet, sunt nesciunt odit aspernatur voluptatem atque ipsa nulla et eligendi, recusandae, esse voluptatibus
							reprehenderit obcaecati? Laborum commodi debitis architecto velit modi quia qui repellendus odio ullam?
						</p>
						<div className="mt-6 flex items-end gap-3 text-2xl md:text-3xl">
							{product.discountPrice && <p className="font-semibold">{`Rs.${product.discountPrice}`}</p>}
							<p className={cn(product.discountPrice ? "text-muted-foreground text-base font-medium line-through" : "font-semibold")}>
								{`Rs.${product.salePrice}`}
							</p>
						</div>
						<Separator className="my-6" />
						<div className="mb-6 overflow-x-auto">
							<table className="w-full max-w-72 table-auto border-collapse">
								<tbody>
									<tr>
										<td className="font-medium">Brand</td>
										<td className="text-muted-foreground">Generic</td>
									</tr>
									<tr>
										<td className="font-medium">Color</td>
										<td className="text-muted-foreground">Multi</td>
									</tr>
								</tbody>
							</table>
						</div>
						<ProductButtons productId={product.id} stock={product.stock} />
					</div>
				</div>
			</section>
			{product.description && (
				<section className="bg-muted/75">
					<div className="container mx-auto space-y-4 px-4 py-8 md:py-10">
						<div
							dangerouslySetInnerHTML={{ __html: product.description }}
							className="prose w-full text-sm wrap-break-word whitespace-pre-line"
						/>
					</div>
				</section>
			)}
			<section className="container mx-auto space-y-4 px-4">
				<h1 className="text-left text-2xl font-semibold">Reviews</h1>
				<div className="rounded-md border p-10 md:p-16">
					<p className="text-muted-foreground/75 text-center">No reviews yet, lead the way and share your thoughts</p>
				</div>
			</section>
			<Suspense>
				<RelatedProducts categoryId={product.categoryId} productId={product.id} />
			</Suspense>
		</div>
	);
}

async function RelatedProducts({ categoryId, productId }: { categoryId: string; productId: string }) {
	const products = await getCategoryProducts(categoryId, productId);
	return (
		<section className="container mx-auto space-y-4 px-4">
			<h1 className="text-left text-2xl font-semibold">You may also like</h1>
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
