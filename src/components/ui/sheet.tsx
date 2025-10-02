"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetCloseButton({ className, ...props }: React.ComponentProps<typeof Button>) {
	return (
		<SheetPrimitive.Close data-slot="sheet-close" asChild {...props}>
			<Button variant="ghost" size="icon" className={cn("size-7", className)} {...props}>
				<XIcon className="size-4" />
			</Button>
		</SheetPrimitive.Close>
	);
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			className={cn(
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in fixed inset-0 z-50 bg-black/50",
				className
			)}
			data-slot="sheet-overlay"
			{...props}
		/>
	);
}

function SheetContent({
	className,
	side = "right",
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: "top" | "right" | "bottom" | "left";
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				className={cn(
					"bg-background data-[state=closed]:animate-out data-[state=open]:animate-in fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
					side === "right" &&
						"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
					side === "left" &&
						"data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
					side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
					side === "bottom" &&
						"data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
					className
				)}
				data-slot="sheet-content"
				{...props}
			/>
		</SheetPortal>
	);
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex w-full justify-between gap-2 border-b p-4", className)} data-slot="sheet-header" {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} data-slot="sheet-footer" {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			className={cn("text-foreground text-base/7 font-semibold md:text-xl/7", className)}
			data-slot="sheet-title"
			{...props}
		/>
	);
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return <SheetPrimitive.Description className={cn("text-muted-foreground text-sm", className)} data-slot="sheet-description" {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetCloseButton };
