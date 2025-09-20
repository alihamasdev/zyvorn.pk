"use client";

import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ErrorComp({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="error" className={cn("mt-10 flex flex-col items-center gap-2", className)} {...props}>
			<TriangleAlertIcon className="text-muted-foreground size-10" />
			<p className="text-muted-foreground text-center text-sm">Something went wrong, please try again.</p>
			<Button variant="outline" onClick={() => window.location.reload()}>
				<RotateCwIcon />
				Retry
			</Button>
		</div>
	);
}
