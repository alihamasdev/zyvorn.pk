"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { createContext, useCallback, useContext, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { motionTokens } from "../lib/motion-tokens";
import styles from "./dialog.module.css";

/** Mirrors the open state so the content can stay mounted while it animates out, and retarget mid-flight if it is reopened or closed early. */
const OpenContext = createContext<boolean | null>(null);

export function Dialog({
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
	const [uncontrolled, setUncontrolled] = useState(defaultOpen);
	const open = openProp ?? uncontrolled;
	const setOpen = useCallback(
		(next: boolean, eventDetails: DialogPrimitive.Root.ChangeEventDetails) => {
			if (openProp === undefined) setUncontrolled(next);
			onOpenChange?.(next, eventDetails);
		},
		[openProp, onOpenChange],
	);
	return (
		<OpenContext.Provider value={open}>
			<DialogPrimitive.Root {...props} open={open} onOpenChange={setOpen} />
		</OpenContext.Provider>
	);
}

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps extends Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>, "title"> {
	title: string;
	description?: string;
	children: ReactNode;
}

const fade: Transition = { duration: motionTokens.duration.instant };
const leave: Transition = { duration: motionTokens.duration.fast, ease: [...motionTokens.ease.standard] };

/** When the title or description changes while open, the new copy rises in and the old copy leaves upward. */
function SwapText({ text }: { text: string }) {
	const reduced = useReducedMotion();
	return (
		<AnimatePresence mode="popLayout" initial={false}>
			<motion.span
				key={text}
				className={styles.swap}
				initial={reduced ? false : { opacity: 0, y: "0.3em", filter: `blur(${motionTokens.blur.soft}px)` }}
				animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
				exit={
					reduced
						? { opacity: 0, transition: { duration: 0 } }
						: {
								opacity: 0,
								y: "-0.3em",
								filter: `blur(${motionTokens.blur.subtle}px)`,
								transition: { duration: motionTokens.duration.fast, ease: [...motionTokens.ease.standard] },
							}
				}
				transition={{ duration: motionTokens.duration.standard, ease: [...motionTokens.ease.enter] }}
			>
				{text}
			</motion.span>
		</AnimatePresence>
	);
}

export function DialogContent({ title, description, children, className, ...props }: DialogContentProps) {
	const open = useContext(OpenContext);
	const reduced = useReducedMotion();
	const classes = [styles.content, className].filter(Boolean).join(" ");
	const inner = (
		<>
			<div className={styles.header}>
				<div>
					<DialogPrimitive.Title className={styles.title}>
						<SwapText text={title} />
					</DialogPrimitive.Title>
					{description ? (
						<DialogPrimitive.Description className={styles.description}>
							<SwapText text={description} />
						</DialogPrimitive.Description>
					) : null}
				</div>
				<DialogPrimitive.Close className={styles.close} aria-label="Close dialog">
					<X size={16} strokeWidth={1.75} aria-hidden="true" />
				</DialogPrimitive.Close>
			</div>
			<div className={styles.body}>{children}</div>
		</>
	);
	// Under a bare Base UI root the open state is unknown here, so CSS keyframes keyed off data-state animate the layers instead.
	if (open === null)
		return (
			<DialogPrimitive.Portal>
				<DialogPrimitive.Backdrop className={`${styles.overlay} ${styles.keyframes}`} />
				<DialogPrimitive.Popup {...props} className={`${classes} ${styles.keyframes}`}>
					{inner}
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		);
	// The overlay fades while the dialog rises 8px and scales up on a spring. Closing is shorter and quieter, and starts from wherever the entrance is.
	return (
		<AnimatePresence>
			{open && (
				<DialogPrimitive.Portal key="dialog" keepMounted>
					<DialogPrimitive.Backdrop
						render={
							<motion.div
								className={styles.overlay}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, transition: reduced ? fade : leave }}
								transition={reduced ? fade : { duration: motionTokens.duration.standard, ease: [...motionTokens.ease.enter] }}
							/>
						}
					/>
					<DialogPrimitive.Popup
						{...props}
						render={
							<motion.div
								className={classes}
								initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={reduced ? { opacity: 0, transition: fade } : { opacity: 0, y: 4, scale: 0.98, transition: leave }}
								transition={
									reduced
										? fade
										: {
												default: motionTokens.spring.smooth,
												opacity: { duration: motionTokens.duration.fast, ease: [...motionTokens.ease.enter] },
											}
								}
							/>
						}
					>
						{inner}
					</DialogPrimitive.Popup>
				</DialogPrimitive.Portal>
			)}
		</AnimatePresence>
	);
}
