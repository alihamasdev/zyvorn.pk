import { useId } from "react";

import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export type FloatingLabelInputProps = React.ComponentProps<"input"> & {
	placeholder: string;
	isInvalid?: boolean;
	errors?: Array<{ message?: string } | undefined>;
};

export function FloatingLabelInput({ className, placeholder, isInvalid, errors, ...props }: FloatingLabelInputProps) {
	const id = useId();
	return (
		<Field data-slot="floating-label-input" orientation={null} className={cn("relative flex w-full flex-col gap-1", className)}>
			<input
				id={id}
				placeholder={placeholder}
				aria-invalid={isInvalid}
				className={cn(
					"peer border-input h-12.5 w-full min-w-0 rounded-md border bg-transparent px-3 pt-5 pb-2 text-sm shadow-xs transition-all duration-300 outline-none",
					"placeholder:text-muted-foreground placeholder-shown:py-3.5",
					"disabled:bg-muted disabled:pointer-events-none",
					"focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-1",
					"aria-invalid:ring-destructive/70 aria-invalid:border-destructive aria-invalid:ring-1",
					"selection:bg-primary selection:text-primary-foreground",
				)}
				{...props}
			/>
			<FieldLabel
				htmlFor={id}
				className={cn(
					"text-muted-foreground absolute top-1.5 left-3 cursor-text text-xs opacity-100 transition-all duration-200",
					"peer-placeholder-shown:top-3 peer-placeholder-shown:opacity-0",
				)}
			>
				{placeholder}
			</FieldLabel>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
