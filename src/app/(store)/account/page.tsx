import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/dashboard/sidebar";

export default async function AccountPage() {
	const session = await getSession();

	if (!session) {
		return redirect("/login");
	}

	const { user } = session;

	return (
		<div className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-4">
						<Avatar className="size-12">
							<AvatarImage src={user.image ?? undefined} alt={user.name} />
							<AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<CardTitle className="text-xl">{user.name}</CardTitle>
							<CardDescription>{user.email}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between rounded-lg border p-3">
						<span className="text-sm font-medium">Role</span>
						<Badge variant="secondary" className="uppercase">
							{user.role || "user"}
						</Badge>
					</div>
				</CardContent>
				<CardFooter className="flex justify-end">
					<SignOutButton />
				</CardFooter>
			</Card>
		</div>
	);
}
