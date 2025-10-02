import { socialLinks } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const whatsapp = socialLinks[0];
	return (
		<>
			<Header />
			<main className="container mx-auto min-h-dvh space-y-6 px-4 py-5 md:py-10">
				{children}
				<Tooltip>
					<TooltipTrigger asChild>
						<a
							href={whatsapp.link}
							target="_blank"
							rel="noopener noreferrer"
							style={{ backgroundColor: "#25D366" }}
							className="fixed bottom-4 left-4 inline-flex size-10 items-center justify-center rounded-full fill-white *:size-1/2 md:bottom-7 md:left-7 md:size-15"
						>
							{whatsapp.icon}
						</a>
					</TooltipTrigger>
					<TooltipContent side="right">{whatsapp.tooltip}</TooltipContent>
				</Tooltip>
			</main>
			<Footer />
		</>
	);
}
