import { TriangleAlertIcon } from "lucide-react";

export function ErrorComp() {
	return (
		<div className="mt-10 flex flex-col items-center gap-2">
			<TriangleAlertIcon className="text-muted-foreground size-10" />
			<p className="text-muted-foreground text-center text-sm">Something went wrong, please try again.</p>
		</div>
	);
}
