import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { productInclude, type ProductPayload } from "@/lib/types";

export async function GET() {
	try {
		const products = (await prisma.product.findMany({
			take: 10,
			include: productInclude,
			orderBy: { createdAt: "desc" }
		})) satisfies ProductPayload[];

		return NextResponse.json(products);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
