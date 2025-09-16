"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { getProducts } from "@/lib/dal";
import { ErrorComp } from "@/components/error";
import { DataTable } from "@/components/pages/dashboard/products/data-table";

export default function ProductsPage() {
	const { data, status } = useQuery({
		queryKey: ["products", "dashboard"],
		queryFn: getProducts,
		staleTime: 15 * 60 * 1000
	});

	if (status === "pending") {
		return <LoaderIcon className="mx-auto mt-10 animate-spin" />;
	}

	if (status === "error") {
		return <ErrorComp />;
	}

	return <DataTable data={data} />;
}
