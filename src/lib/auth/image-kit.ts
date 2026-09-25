"use server";

import "server-only";

import { getUploadAuthParams } from "@imagekit/next/server";

import { getAdminSession } from "@/lib/auth/server";

export async function imageAuth() {
	await getAdminSession();

	const data = getUploadAuthParams({
		privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
		publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!
	});

	return { ...data, publicKey: process.env.IMAGE_KIT_PUBLIC_KEY! };
}
