import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/tanstack/query-provider";
import "./globals.css";

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "ZYVORN",
	description: "Full stack ecommerce app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body style={poppins.style}>
				<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
					<QueryProvider>
						<NuqsAdapter>{children}</NuqsAdapter>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
