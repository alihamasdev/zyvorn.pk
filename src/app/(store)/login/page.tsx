import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/server";
import { LoginForm } from "./form";

export default function LoginPage() {
	return (
		<div className="container mx-auto flex flex-1 items-center justify-center px-4">
			<Suspense fallback={null}>
				<LoginAuthCheck />
			</Suspense>
			<LoginForm />
		</div>
	);
}

async function LoginAuthCheck() {
	const session = await getSession();
	if (session) return redirect("/account");
	return null;
}
