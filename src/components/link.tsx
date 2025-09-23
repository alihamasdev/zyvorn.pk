"use client";

import { useState } from "react";
import type { Route } from "next";
import NextLink from "next/link";

export function Link({ href, ...props }: React.ComponentProps<typeof NextLink> & { href: Route }) {
	const [prefetch, setPrefetch] = useState(false);
	return <NextLink href={href} {...props} prefetch={prefetch} onMouseEnter={() => setPrefetch(true)} />;
}
