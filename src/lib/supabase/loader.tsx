"use client";

import type { ImageLoaderProps } from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export default function supabaseLoader({ src, width, quality }: ImageLoaderProps) {
	const url = new URL(`${supabaseUrl}/storage/v1/object/public/${src}`);
	url.searchParams.set("width", width.toString());
	url.searchParams.set("quality", (quality || 75).toString());
	return url.href;
}
