"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react";
import { ChevronLeft as NavArrowLeft, ChevronRight as NavArrowRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, animate, motion, useReducedMotion } from "motion/react";
import type { AnimationPlaybackControls, Variants } from "motion/react";
import { createContext, useCallback, useContext, useId, useLayoutEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, RefObject } from "react";

import { motionTokens } from "../lib/motion-tokens";
import styles from "./tabs.module.css";

type RootProps = Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "value" | "defaultValue" | "onValueChange"> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
};

/** `direction` is +1 when the new tab sits after the old one; `panelHeightRef` holds the visible panel height so the next panel can morph from it; `leavingRectRef` pins the outgoing panel where it was on screen. */
const TabsContext = createContext<{
	active: string;
	layoutId: string;
	direction: number;
	panelHeightRef: RefObject<number | null>;
	leavingRectRef: RefObject<DOMRect | null>;
}>({ active: "", layoutId: "tabs", direction: 1, panelHeightRef: { current: null }, leavingRectRef: { current: null } });

export function Tabs({ value, defaultValue, onValueChange, className, ...props }: RootProps) {
	const [internal, setInternal] = useState(defaultValue ?? "");
	const [direction, setDirection] = useState(1);
	const active = value ?? internal;
	const layoutId = useId();
	const root = useRef<HTMLDivElement>(null);
	const panelHeightRef = useRef<number | null>(null);
	const leavingRectRef = useRef<DOMRect | null>(null);
	function handleChange(next: string) {
		const frame = root.current;
		leavingRectRef.current = frame?.querySelector(':scope > [role="tabpanel"][data-state="active"]')?.getBoundingClientRect() ?? null;
		const order = frame
			? Array.from(frame.querySelectorAll<HTMLElement>('[role="tab"][data-value]'))
					.filter((tab) => tab.closest(`.${styles.root}`) === frame)
					.map((tab) => tab.dataset.value)
			: [];
		const from = order.indexOf(active),
			to = order.indexOf(next);
		if (from >= 0 && to >= 0 && from !== to) setDirection(to > from ? 1 : -1);
		if (value === undefined) setInternal(next);
		onValueChange?.(next);
	}
	return (
		<TabsContext.Provider value={{ active, layoutId, direction, panelHeightRef, leavingRectRef }}>
			<LayoutGroup id={layoutId}>
				<TabsPrimitive.Root
					{...props}
					ref={root}
					className={[styles.root, className].filter(Boolean).join(" ")}
					value={active}
					onValueChange={(val) => handleChange(String(val))}
				/>
			</LayoutGroup>
		</TabsContext.Provider>
	);
}

export function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
	const { active } = useContext(TabsContext);
	const reduced = useReducedMotion();
	const shell = useRef<HTMLDivElement>(null);
	const viewport = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLDivElement>(null);
	const [edges, setEdges] = useState({ overflow: false, left: false, right: false });
	const update = useCallback(() => {
		const frame = shell.current;
		const scroll = viewport.current;
		if (!frame || !scroll) return;
		const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
		const next = { overflow: scroll.scrollWidth > frame.clientWidth + 1, left: scroll.scrollLeft > 1, right: scroll.scrollLeft < max - 1 };
		setEdges((previous) =>
			previous.overflow === next.overflow && previous.left === next.left && previous.right === next.right ? previous : next,
		);
	}, []);
	const reveal = useCallback(
		(tab: HTMLElement | null) => {
			const scroll = viewport.current;
			if (!scroll || !tab) return;
			const frame = scroll.getBoundingClientRect();
			const item = tab.getBoundingClientRect();
			const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
			const left = frame.left + (scroll.scrollLeft > 1 ? 34 : 0);
			const right = frame.right - (scroll.scrollLeft < max - 1 ? 34 : 0);
			const delta = item.left < left ? item.left - left : item.right > right ? item.right - right : 0;
			if (delta) scroll.scrollBy({ left: delta, behavior: reduced ? "instant" : "smooth" });
		},
		[reduced],
	);
	useLayoutEffect(() => {
		const frame = shell.current;
		const scroll = viewport.current;
		const content = list.current;
		if (!frame || !scroll || !content) return;
		const observer = new ResizeObserver(update);
		observer.observe(frame);
		observer.observe(scroll);
		observer.observe(content);
		scroll.addEventListener("scroll", update, { passive: true });
		return () => {
			observer.disconnect();
			scroll.removeEventListener("scroll", update);
		};
	}, [update]);
	useLayoutEffect(() => {
		const scroll = viewport.current;
		if (!scroll) return;
		const activeTab = scroll.querySelector<HTMLElement>(`[role="tab"][data-value="${active}"]`);
		reveal(activeTab);
	}, [active, reveal]);
	function scrollTabs(direction: -1 | 1) {
		const scroll = viewport.current;
		if (!scroll) return;
		const delta = (scroll.clientWidth - 48) * direction;
		scroll.scrollBy({ left: delta, behavior: reduced ? "instant" : "smooth" });
	}
	return (
		<div ref={shell} className={styles.container}>
			{edges.overflow && (
				<button
					type="button"
					className={`${styles.scrollButton} ${styles.scrollLeft}`}
					aria-label="Scroll tabs left"
					disabled={!edges.left}
					onClick={() => scrollTabs(-1)}
				>
					<NavArrowLeft width={17} height={17} aria-hidden="true" />
				</button>
			)}
			<motion.div
				ref={viewport}
				className={styles.scrollArea}
				onKeyDown={(event) => {
					if (event.target instanceof HTMLElement && event.target.getAttribute("role") === "tab") reveal(event.target);
				}}
			>
				<TabsPrimitive.List {...props} ref={list} className={[styles.list, className].filter(Boolean).join(" ")} />
			</motion.div>
			{edges.overflow && (
				<button
					type="button"
					className={`${styles.scrollButton} ${styles.scrollRight}`}
					aria-label="Scroll tabs right"
					disabled={!edges.right}
					onClick={() => scrollTabs(1)}
				>
					<NavArrowRight width={17} height={17} aria-hidden="true" />
				</button>
			)}
		</div>
	);
}

export function TabsTrigger({
	className,
	children,
	value,
	...props
}: Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>, "value"> & { value: string }) {
	const { active } = useContext(TabsContext);
	const reduced = useReducedMotion();
	// The LayoutGroup in Tabs scopes the highlight to this instance, so it glides between triggers but never flies in from another tab set.
	return (
		<TabsPrimitive.Tab {...props} value={value} data-value={value} className={[styles.trigger, className].filter(Boolean).join(" ")}>
			{active === value && (
				<motion.span
					className={styles.selection}
					layoutId="selection"
					layoutDependency={active}
					transition={reduced ? { duration: 0 } : motionTokens.spring.morph}
					aria-hidden="true"
				/>
			)}
			<span className={styles.triggerLabel}>{children}</span>
		</TabsPrimitive.Tab>
	);
}

const panelMotion: Variants = {
	enter: (direction: number) => ({ opacity: 0, x: direction * 8 }),
	center: {
		opacity: 1,
		x: 0,
		transition: {
			opacity: { duration: motionTokens.duration.standard, ease: [...motionTokens.ease.enter] },
			x: motionTokens.spring.smooth,
		},
	},
	exit: (direction: number) => ({
		opacity: 0,
		x: direction * -6,
		transition: { duration: motionTokens.duration.instant, ease: [...motionTokens.ease.standard] },
	}),
};
/** Reduced motion: a short crossfade in place. Keys match panelMotion so server and client render identical styles. */
const panelFade: Variants = {
	enter: { opacity: 0, x: 0 },
	center: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.instant } },
	exit: { opacity: 0, x: 0, transition: { duration: 0.1 } },
};

export interface TabsContentProps extends Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>, "value"> {
	value: string;
	forceMount?: boolean;
}

export function TabsContent({ className, value, forceMount, children, ...props }: TabsContentProps) {
	const { active, direction, panelHeightRef, leavingRectRef } = useContext(TabsContext);
	const reduced = useReducedMotion();
	const panel = useRef<HTMLDivElement>(null);
	const selected = active === value;
	const classes = [styles.content, className].filter(Boolean).join(" ");
	// The incoming panel starts at the outgoing panel's height and settles at its own, so content below glides instead of jumping.
	useLayoutEffect(() => {
		const node = panel.current;
		if (!node || forceMount) return;
		// Outgoing: the tab root may have changed size around it, so pin the panel to where it was while it fades.
		if (!selected) {
			const before = leavingRectRef.current;
			const now = node.getBoundingClientRect();
			if (before) node.style.translate = `${before.left - now.left}px ${before.top - now.top}px`;
			node.inert = true;
			return;
		}
		node.style.translate = "";
		node.inert = false;
		const from = panelHeightRef.current;
		const to = node.offsetHeight;
		let controls: AnimationPlaybackControls | undefined;
		const release = () => {
			node.style.height = "";
			node.style.overflow = "";
		};
		if (from !== null && Math.abs(from - to) > 1 && !reduced) {
			if (to > from) node.style.overflow = "clip";
			controls = animate(node, { height: [from, to] }, { ...motionTokens.spring.smooth, onComplete: release });
		}
		panelHeightRef.current = controls && from !== null ? from : to;
		const observer = new ResizeObserver(() => {
			panelHeightRef.current = node.offsetHeight;
		});
		observer.observe(node);
		return () => {
			observer.disconnect();
			controls?.stop();
			release();
		};
	}, [selected, reduced, forceMount, panelHeightRef, leavingRectRef]);
	if (forceMount)
		return (
			<TabsPrimitive.Panel {...props} value={value} keepMounted className={classes}>
				{children}
			</TabsPrimitive.Panel>
		);
	return (
		<AnimatePresence initial={false} mode="popLayout" custom={direction}>
			{selected && (
				<TabsPrimitive.Panel
					{...props}
					key={value}
					value={value}
					keepMounted
					render={
						<motion.div
							ref={panel}
							className={classes}
							custom={direction}
							variants={reduced ? panelFade : panelMotion}
							initial="enter"
							animate="center"
							exit="exit"
						/>
					}
				>
					{children}
				</TabsPrimitive.Panel>
			)}
		</AnimatePresence>
	);
}
