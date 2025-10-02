"use client";

import { ShoppingCartIcon } from "lucide-react";

import { Sheet, SheetCloseButton, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Cart() {
	return (
		<Sheet>
			<SheetTrigger className="relative inline-flex size-9 items-center justify-center">
				<ShoppingCartIcon className="size-4.5" />
				<span className="bg-foreground text-background absolute top-0 right-0 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums">
					0
				</span>
			</SheetTrigger>
			<SheetContent className="w-full">
				<SheetHeader>
					<SheetTitle>Shopping Cart</SheetTitle>
					<SheetCloseButton />
					<SheetDescription hidden />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
