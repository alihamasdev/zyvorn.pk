import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { QueryProvider } from "@/lib/tanstack/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const outfit = Outfit({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "ZYVORN",
	description: "Full stack ecommerce app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body style={outfit.style} suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
					<QueryProvider>
						<NuqsAdapter>{children}</NuqsAdapter>
					</QueryProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
