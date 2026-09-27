"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { type Prisma } from "@/lib/prisma/client";

const cartSelect = {
	id: true,
	items: {
		orderBy: { createdAt: "asc" },
		select: {
			quantity: true,
			product: { select: { id: true, title: true, slug: true, images: true, salePrice: true, discountPrice: true } },
		},
	},
} satisfies Prisma.CartSelect;

const setCartCookie = async (cartId: string) => {
	try {
		const cookieStore = await cookies();
		return cookieStore.set("cartId", cartId, {
			path: "/",
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			httpOnly: false,
		});
	} catch {
		// Ignore if called in a read-only Server Component rendering context
	}
};

const createCartAndReturn = async (userId?: string | null) => {
	const cart = await db.cart.create({
		data: { userId },
		select: cartSelect,
	});

	await setCartCookie(cart.id);

	return cart;
};

export async function getCart(cartId?: string) {
	const requestedCartId = cartId;
	// If no cartId is provided, check cookies for cartId
	if (!cartId) {
		const cookieStore = await cookies();
		cartId = cookieStore.get("cartId")?.value;
	}

	// If cartId is found, return the cart
	if (cartId) {
		const cart = await db.cart.findUnique({
			where: { id: cartId },
			select: cartSelect,
		});

		if (cart) return cart;
		// If a specific cartId was explicitly queried and does not exist, return null
		if (requestedCartId) return null;
	}

	// If no cartId is found, check for user session
	const user = await getSession();
	// If no user is found, create a new cart
	if (!user) return await createCartAndReturn();

	// If user is found, check for the user's cart
	const cart = await db.cart.findFirst({
		where: { userId: user.user.id },
		select: cartSelect,
	});

	// If user's cart is found, return it
	if (cart) {
		await setCartCookie(cart.id);
		return cart;
	}

	// If no cart is found, create a new cart
	return await createCartAndReturn(user.user.id);
}

export async function addToCart(productId: string, quantity: number = 1, cartId?: string) {
	if (!cartId) {
		const cookieStore = await cookies();
		cartId = cookieStore.get("cartId")?.value;
	}

	if (!cartId) {
		const user = await getSession();
		const cart = await db.cart.create({ data: { userId: user?.user.id } });
		cartId = cart.id;
		await setCartCookie(cart.id);
	}

	const existingItem = await db.cartItem.findFirst({
		where: { cartId, productId },
	});

	if (existingItem) {
		await db.cartItem.update({
			where: { id: existingItem.id },
			data: { quantity: existingItem.quantity + quantity },
		});
	} else {
		await db.cartItem.create({
			data: { cartId, productId, quantity },
		});
	}
}

export async function removeFromCart(productId: string, cartId?: string) {
	if (!cartId) {
		const cookieStore = await cookies();
		cartId = cookieStore.get("cartId")?.value;
	}

	if (!cartId) {
		throw new Error("No cart found");
	}

	const item = await db.cartItem.findFirst({
		where: { cartId, productId },
	});

	if (item) {
		await db.cartItem.delete({
			where: { id: item.id },
		});
	}
}

export async function buyNow(productId: string, quantity: number = 1) {
	const cart = await db.cart.create({ data: { isSingle: true, items: { create: { productId, quantity } } } });
	redirect(`/checkout/${cart.id}`);
}
