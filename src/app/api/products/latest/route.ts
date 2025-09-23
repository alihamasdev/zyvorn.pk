import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { productCardSelect, type ProductCardPayload } from "@/lib/types";

export async function GET() {
	try {
		const products = (await prisma.product.findMany({
			take: 10,
			select: productCardSelect,
			orderBy: { createdAt: "desc" }
		})) satisfies ProductCardPayload[];

		return NextResponse.json(products);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
