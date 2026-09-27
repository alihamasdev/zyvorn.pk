import { useId } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectValue } from "@/components/ui/select";

type FloatingLabelSelectProps = React.ComponentProps<typeof Select> & {
	placeholder: string;
	isInvalid?: boolean;
	className?: string;
	errors?: Array<{ message?: string } | undefined>;
};

export function FloatingLabelSelect({ placeholder, value, isInvalid, errors, className, children, ...props }: FloatingLabelSelectProps) {
	const id = useId();
	return (
		<Field data-slot="floating-label-select" orientation={null} className="relative flex flex-row gap-1">
			<Select aria-invalid={isInvalid} value={value} {...props}>
				<SelectPrimitive.Trigger
					data-slot="select-trigger"
					className={cn(
						"peer border-input data-placeholder:text-muted-foreground flex h-12.5 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent py-2 pr-9 pl-3 text-sm whitespace-nowrap capitalize shadow-xs transition-[color,box-shadow] outline-none",
						value && "pt-5 pb-2",
						"disabled:bg-muted disabled:pointer-events-none",
						"focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-1",
						"aria-invalid:ring-destructive/70 aria-invalid:border-destructive aria-invalid:ring-1",
						"[&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
						className,
					)}
				>
					<SelectValue placeholder={placeholder} className="line-clamp-1 flex items-center gap-2" />
					<SelectPrimitive.Icon asChild>
						<ChevronDownIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50" />
					</SelectPrimitive.Icon>
				</SelectPrimitive.Trigger>
				<SelectContent>{children}</SelectContent>
			</Select>
			<FieldLabel
				htmlFor={id}
				className={cn(
					"text-muted-foreground absolute left-3 text-xs transition-all duration-200",
					value ? "top-1.5 text-xs opacity-100" : "top-3 opacity-0",
				)}
			>
				{placeholder}
			</FieldLabel>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
