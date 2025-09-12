import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function LogoutDialog({ ...props }: React.ComponentProps<typeof Dialog>) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const logoutUser = () => {
		startTransition(async () => {
			const { auth } = createClient();
			await auth.signOut();
			router.push("/");
		});
	};

	return (
		<Dialog {...props}>
			<DialogContent className="max-w-75 sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Are you sure to logout?</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					This will only apply to this account, and you&apos;ll still be logged in to your other accounts.
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button className="disabled:opacity-100" disabled={isPending} variant="secondary">
							Cancel
						</Button>
					</DialogClose>
					<Button variant="destructive" className="disabled:opacity-100" disabled={isPending} onClick={logoutUser}>
						{isPending && <LoaderIcon className="animate-spin" />}
						Logout
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
