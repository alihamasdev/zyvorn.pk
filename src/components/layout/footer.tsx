import { socialLinks } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Footer() {
	return (
		<footer className="w-full border-t text-sm">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-[1.5fr_2fr] md:py-10">
					<div className="space-y-1 md:space-y-3">
						<h1 className="text-xl/7 font-semibold">ZYVORN</h1>
						<p className="text-muted-foreground text-xs md:text-sm">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
							text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
						</p>
					</div>
					<div className="flex gap-5">
						<div className="flex w-full items-start justify-start md:justify-center">
							<div className="space-y-1 md:space-y-3">
								<h2 className="text-base/7 font-medium">Company</h2>
								<div className="text-muted-foreground *:hover:text-primary space-y-2 text-left">
									<p className="decoration-gradient before:[h-2px] w-fit px-1 pb-px">Home</p>
									<p className="decoration-gradient before:[h-2px] w-fit px-1 pb-px">Shop</p>
									<p className="decoration-gradient before:[h-2px] w-fit px-1 pb-px">About</p>
									<p className="decoration-gradient before:[h-2px] w-fit px-1 pb-px">Contact</p>
								</div>
							</div>
						</div>
						<div className="flex w-full items-start justify-start md:justify-center">
							<div className="space-y-1 md:space-y-3">
								<h2 className="text-base/7 font-medium">Get in touch</h2>
								<div className="text-muted-foreground space-y-2 text-left">
									<a
										href="tel:+923707525627"
										target="_blank"
										rel="noopener noreferrer"
										className="decoration-gradient before:[h-2px] block w-fit px-1 pb-px"
									>
										+92 370 7525627
									</a>
									<a
										href="mailto:zyvorn.pk1@gmail.com"
										target="_blank"
										rel="noopener noreferrer"
										className="decoration-gradient before:[h-2px] block w-fit px-1 pb-px"
									>
										zyvorn.pk1@gmail.com
									</a>
									<div className="fill-muted-foreground *:hover:fill-primary mt-4 flex items-center gap-x-4 *:cursor-pointer *:transition-colors *:duration-300">
										{socialLinks.map(({ title, tooltip, link, icon }) => (
											<Tooltip key={title}>
												<TooltipTrigger asChild>
													<a href={link.toString()} target="_blank" rel="noopener noreferrer">
														{icon}
													</a>
												</TooltipTrigger>
												<TooltipContent>{tooltip}</TooltipContent>
											</Tooltip>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<p className="text-muted-foreground container mx-auto w-full px-4 pb-5 text-center">Copyright &copy; 2025, All rights reserved</p>
		</footer>
	);
}
