"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import styles from "./popover.module.css";

export const Popover = PopoverPrimitive.Root;
export const PopoverClose = PopoverPrimitive.Close;

/** The trigger anchors the panel, so it opts out of press-scale: a scaled rect measured on open would shift the panel as the trigger springs back. */
export const PopoverTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>>(
	function PopoverTrigger({ className, ...props }, ref) {
		return <PopoverPrimitive.Trigger {...props} ref={ref} className={[styles.anchor, className].filter(Boolean).join(" ")} />;
	},
);

PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> {
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	collisionPadding?: number;
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
	{ className, align = "start", side = "bottom", sideOffset = 6, collisionPadding = 10, ...props },
	ref,
) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner align={align} side={side} sideOffset={sideOffset} collisionPadding={collisionPadding}>
				<PopoverPrimitive.Popup {...props} ref={ref} className={[styles.content, className].filter(Boolean).join(" ")} />
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
});

PopoverContent.displayName = "PopoverContent";
