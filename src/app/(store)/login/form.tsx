"use client";

import { useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { CheckIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/components/icons";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
});

export function LoginForm() {
	const [isPending, startTransition] = useTransition();
	const [isResending, startResendTransition] = useTransition();
	const [sentEmail, setSentEmail] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "" },
		validators: { onSubmit: loginSchema },
		onSubmit: ({ value: { email } }) => {
			startTransition(async () => {
				await signIn.magicLink(
					{ email, name: email.split("@")[0], callbackURL: "/account" },
					{
						onSuccess: () => {
							setSentEmail(email);
							toast.success("Magic sign-in link sent");
						},
						onError: ({ error }) => {
							toast.error(error.message || "Something went wrong");
						},
					}
				);
			});
		},
	});

	const handleResend = () => {
		if (!sentEmail) return;
		startResendTransition(async () => {
			await signIn.magicLink(
				{
					email: sentEmail,
					name: sentEmail.split("@")[0],
					callbackURL: "/account",
				},
				{
					onSuccess: () => {
						toast.success("A new sign-in link has been sent");
					},
					onError: ({ error }) => {
						toast.error(error.message || "Failed to resend email");
					},
				}
			);
		});
	};

	// Sent state: User submitted email and is waiting for magic link
	if (sentEmail) {
		return (
			<Card className="w-full max-w-sm">
				<CardContent className="pt-6">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
							<CheckIcon className="size-6 stroke-[2.5]" />
						</div>

						<div className="space-y-1.5">
							<h3 className="text-lg font-semibold tracking-tight">
								Check your email
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								We sent a sign-in link to{" "}
								<span className="font-medium text-foreground">
									{sentEmail}
								</span>
								. Click the link in your email to log in.
							</p>
						</div>

						<div className="bg-muted/50 text-muted-foreground rounded-lg p-3 text-xs leading-relaxed">
							Can't find it? Check your <strong>spam</strong> or junk folder.
						</div>

						<div className="flex w-full flex-col gap-2 pt-2">
							<Button
								variant="outline"
								className="w-full"
								disabled={isResending}
								onClick={handleResend}
							>
								{isResending ? <Spinner /> : "Resend link"}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => setSentEmail(null)}
							>
								Use a different email
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Initial login input state
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email and we'll send you a login link.
				</CardDescription>
			</CardHeader>
			<CardContent>
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
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field className="gap-1">
										<FieldLabel aria-invalid={isInvalid}>Email</FieldLabel>
										<InputGroup>
											<InputGroupInput
												id={field.name}
												name={field.name}
												type="email"
												placeholder="someone@example.com"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.target.value)
												}
												aria-invalid={isInvalid}
											/>
											<InputGroupAddon>
												<MailIcon />
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && (
											<FieldError
												className="text-sm"
												errors={field.state.meta.errors}
											/>
										)}
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
			</CardContent>
		</Card>
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
						}
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
