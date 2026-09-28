import { type Metadata } from "next";
import { Outfit } from "next/font/google";
import { ImageKitProvider } from "@imagekit/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { QueryProvider } from "@/lib/tanstack/query-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const outfit = Outfit({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Three",
	description: "Full stack e-commerce application built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	const urlEndpoint = process.env.IMAGE_KIT_URL_ENDPOINT ?? "";
	return (
		<html lang="en" data-scroll-behavior="smooth" className="scroll-smooth">
			<body className="scroll-smooth antialiased" style={outfit.style}>
				<QueryProvider>
					<NuqsAdapter>
						<ImageKitProvider urlEndpoint={urlEndpoint} transformationPosition="path">
							{children}
						</ImageKitProvider>
					</NuqsAdapter>
				</QueryProvider>
				<Toaster />
			</body>
		</html>
	);
}
