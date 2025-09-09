"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type LoginSchema, loginSchema } from "./schema";

export async function loginAction(values: LoginSchema) {
	const { success } = loginSchema.safeParse(values);
	if (!success) return "Please provider correct values";

	const { auth } = await createClient();
	const { error } = await auth.signInWithPassword(values);

	if (error) {
		return error.message;
	}

	redirect("/dashboard");
}
