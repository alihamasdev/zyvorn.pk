import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<main className="container mx-auto min-h-dvh space-y-5 px-4 py-5 md:py-10">{children}</main>
			<Footer />
		</>
	);
}
