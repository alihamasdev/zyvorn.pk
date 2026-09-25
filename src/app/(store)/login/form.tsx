"use client";

import { useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { MailIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/components/icons";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
});

export function LoginForm() {
	const [isPending, startTransition] = useTransition();

	const form = useForm({
		defaultValues: { email: "" },
		validators: { onSubmit: loginSchema },
		onSubmit: ({ value: { email } }) => {
			startTransition(async () => {
				await signIn.magicLink(
					{ email, name: email.split("@")[0], callbackURL: "/account" },
					{
						onSuccess: () => {
							toast.success(`Email with the link has been sent`);
						},
						onError: ({ error }) => {
							toast.error(error.message || "Something went wrong");
						},
					},
				);
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup className="gap-4">
				<form.Field
					name="email"
					children={(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field className="gap-1">
								<FieldLabel aria-invalid={isInvalid}>Email</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id={field.name}
										name={field.name}
										placeholder="someone@example.com"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
									/>
									<InputGroupAddon>
										<MailIcon />
									</InputGroupAddon>
								</InputGroup>
								{isInvalid && <FieldError className="text-sm" errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
				<Field orientation="vertical">
					<Button type="submit" disabled={isPending}>
						{isPending ? <Spinner /> : "Send Link"}
					</Button>
					<div className="flex items-center gap-2">
						<div className="w-full border-t" />
						<div className="text-muted-foreground text-sm">or</div>
						<div className="w-full border-t" />
					</div>
					<GoogleLoginButton />
				</Field>
			</FieldGroup>
		</form>
	);
}

function GoogleLoginButton() {
	const [isPending, startTransition] = useTransition();

	return (
		<Button
			variant="outline"
			className="w-full disabled:opacity-100"
			disabled={isPending}
			onClick={() =>
				startTransition(async () => {
					await signIn.social(
						{ provider: "google", callbackURL: "/account" },
						{
							onError: () => {
								toast.error("Something went wrong, please try again");
							},
						},
					);
				})
			}
		>
			{isPending ? (
				<Spinner />
			) : (
				<>
					<GoogleIcon />
					<span>Continue with Google</span>
				</>
			)}
		</Button>
	);
}
