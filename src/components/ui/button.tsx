import { cva, type VariantProps } from "class-variance-authority";
import { LoaderIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline"
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3 rounded-full",
				sm: "h-8 gap-1.5 rounded-full px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
				icon: "size-9"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	}
);

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

function Button({ className, variant, size, type = "button", asChild = false, ...props }: ButtonProps) {
	const Comp = asChild ? SlotPrimitive.Slot : "button";

	return <Comp className={cn(buttonVariants({ variant, size, className }))} data-slot="button" type={type} {...props} />;
}

interface LoaderButtonProps extends ButtonProps {
	loading?: boolean;
	children?: string;
	loadingText?: string;
}

function LoaderButton({ loading, children = "Submit", loadingText = "Submitting", ...props }: LoaderButtonProps) {
	return (
		<Button disabled={loading} {...props}>
			{loading && <LoaderIcon className="animate-spin" />}
			{loading ? loadingText : children}
		</Button>
	);
}

export { Button, LoaderButton, buttonVariants };
