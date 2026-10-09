"use server";

import "server-only";

import { getUploadAuthParams } from "@imagekit/next/server";

import { getAdminSession, getSession } from "@/lib/auth/server";

export async function imageAuth(intent: "product" | "review" = "product") {
	if (intent === "product") {
		await getAdminSession();
	} else if (intent === "review") {
		const session = await getSession();
		if (!session) throw new Error("Unauthorized");
	}

	const data = getUploadAuthParams({
		privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
		publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!,
	});

	return { ...data, publicKey: process.env.IMAGE_KIT_PUBLIC_KEY! };
}

export async function deleteImagesByFileIds(fileIds: string[]) {
	if (!fileIds.length) return { success: true };
	try {
		await getAdminSession();
		const auth = Buffer.from(`${process.env.IMAGE_KIT_PRIVATE_KEY}:`).toString("base64");
		const res = await fetch("https://api.imagekit.io/v1/files/batch/deleteByFileIds", {
			method: "POST",
			headers: {
				Authorization: `Basic ${auth}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fileIds }),
		});

		if (!res.ok) {
			const text = await res.text();
			console.error("Failed to bulk delete images from ImageKit:", text);
			return { success: false, error: text };
		}

		return { success: true };
	} catch (error) {
		console.error("Error bulk deleting images from ImageKit:", error);
		return { success: false, error: "Failed to delete files" };
	}
}

export async function deleteImage(filePath: string, fileId?: string | null) {
	try {
		await getAdminSession();
		const auth = Buffer.from(`${process.env.IMAGE_KIT_PRIVATE_KEY}:`).toString("base64");

		if (fileId) {
			const deleteRes = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
				method: "DELETE",
				headers: { Authorization: `Basic ${auth}` },
			});
			if (!deleteRes.ok && deleteRes.status !== 404) {
				return { success: false, error: "Failed to delete from ImageKit" };
			}
			return { success: true };
		}

		const name = filePath.split("/").pop();
		if (!name) return { success: false, error: "Invalid file path" };

		const searchRes = await fetch(`https://api.imagekit.io/v1/files?searchQuery=${encodeURIComponent(`name = "${name}"`)}`, {
			headers: { Authorization: `Basic ${auth}` },
		});

		if (!searchRes.ok) {
			return { success: false, error: "Failed to search file in ImageKit" };
		}

		const files = (await searchRes.json()) as Array<{ fileId: string }>;
		if (files.length > 0 && files[0]?.fileId) {
			const deleteRes = await fetch(`https://api.imagekit.io/v1/files/${files[0].fileId}`, {
				method: "DELETE",
				headers: { Authorization: `Basic ${auth}` },
			});
			if (!deleteRes.ok && deleteRes.status !== 404) {
				return { success: false, error: "Failed to delete from ImageKit" };
			}
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting image from ImageKit:", error);
		return { success: false, error: "Failed to delete file" };
	}
}
