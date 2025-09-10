"use client";

import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				"peer border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:data-[state=checked]:bg-primary dark:aria-invalid:ring-destructive/40 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			data-slot="checkbox"
			{...props}
		>
			<CheckboxPrimitive.Indicator className="flex items-center justify-center text-current transition-none" data-slot="checkbox-indicator">
				<CheckIcon className="size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
