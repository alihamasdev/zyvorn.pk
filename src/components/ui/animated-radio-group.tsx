"use client";

import { useId } from "react";
import { Label as LabelPrimitive, RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Field, FieldError } from "@/components/ui/field";

export type AnimatedRadioGroupItem = {
	label: string;
	value: string;
	description?: React.ReactNode;
};

export type AnimatedRadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
	isInvalid?: boolean;
	items: AnimatedRadioGroupItem[];
	errors?: Array<{ message?: string } | undefined>;
};

export function AnimatedRadioGroup({ items, className, isInvalid, errors, ...props }: AnimatedRadioGroupProps) {
	return (
		<Field data-slot="animated-radio-group" orientation={null} className={cn("flex flex-col gap-2", className)}>
			<RadioGroupPrimitive.Root className="grid rounded-md shadow-xs" {...props}>
				{items.map((item) => {
					const id = useId();
					return (
						<LabelPrimitive.Label
							key={item.value}
							htmlFor={id}
							className={cn(
								"border-input relative flex cursor-pointer flex-col border bg-transparent text-sm first:rounded-t-md last:rounded-b-md",
								"has-data-[state=checked]:border-primary/70 has-data-[state=checked]:bg-primary/5",
								"has-disabled:cursor-not-allowed has-disabled:opacity-50",
								className,
							)}
						>
							<RadioGroupPrimitive.Item value={item.value} id={id} className="group flex cursor-pointer flex-col p-3">
								<div className="flex items-center gap-2">
									<RadioGroupIndicator />
									<p className="font-medium">{item.label}</p>
								</div>
								<div
									className={cn(
										"grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-in-out",
										item.description && "group-data-[state=checked]:grid-rows-[1fr]",
									)}
								>
									<div className="overflow-hidden">
										<div className="text-muted-foreground animate-fadeIn pt-4 pl-6 text-left text-sm">{item.description}</div>
									</div>
								</div>
							</RadioGroupPrimitive.Item>
						</LabelPrimitive.Label>
					);
				})}
			</RadioGroupPrimitive.Root>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}

function RadioGroupIndicator() {
	return (
		<div className="border-input has-data-[state=checked]:bg-primary has-data-[state=checked]:border-primary/70 aspect-square size-4 shrink-0 overflow-hidden rounded-full border shadow-xs transition-shadow outline-none">
			<RadioGroupPrimitive.Indicator className="flex aspect-square items-center justify-center">
				<svg fill="white" height="6" viewBox="0 0 6 6" width="6" xmlns="http://www.w3.org/2000/svg">
					<circle cx="3" cy="3" r="3" />
				</svg>
			</RadioGroupPrimitive.Indicator>
		</div>
	);
}
