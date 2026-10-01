"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { COUNTRY, PAYMENT_METHOD, PROVINCE } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";
import { AnimatedRadioGroup } from "@/components/ui/animated-radio-group";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelSelect } from "@/components/ui/floating-label-select";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { checkoutAction } from "@/components/checkout/action";
import { checkoutSchema, type CheckoutSchema } from "@/components/checkout/schema";
import QR from "~/public/qr.png";

const SuccessCheckout = dynamic(() => import("./success-checkout"), { ssr: false });

type CheckoutFormProps = React.ComponentProps<"form"> & {
	cartId: string;
	provinces: string[];
	defaultValues: CheckoutSchema;
};

export function CheckoutForm({ className, cartId, defaultValues, provinces, children, ...props }: CheckoutFormProps) {
	const queryClient = useQueryClient();

	const [orderId, setOrderId] = useState<string | null>(null);
	const [isSucceed, setIsSucceed] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm({
		defaultValues,
		validators: { onSubmit: checkoutSchema },
		onSubmit: ({ value }) => {
			startTransition(async () => {
				const res = await checkoutAction(value, cartId);
				if (res.error) {
					toast.error(res.error);
					return;
				}
				setOrderId(res.orderId ?? null);
				setIsSucceed(true);
				queryClient.refetchQueries({ queryKey: ["cart"] });
			});
		},
	});

	return (
		<>
			{isSucceed && (
				<SuccessCheckout orderId={orderId ?? undefined} paymentMethod={form.state.values.paymentMethod} isLogin={!!defaultValues.email} />
			)}
			<form
				className={cn("space-y-6", className)}
				{...props}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="space-y-3">
					<h2 className="text-xl font-semibold">Contact</h2>
					<form.Field
						name="email"
						children={(field) => (
							<FloatingLabelInput
								name={field.name}
								placeholder="Email"
								value={field.state.value}
								onBlur={field.handleBlur}
								errors={field.state.meta.errors}
								onChange={(e) => field.handleChange(e.target.value)}
								isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
								disabled={isPending}
							/>
						)}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="text-xl font-semibold">Delivery</h2>
					<div className="grid gap-3 md:grid-cols-2">
						<form.Field
							name="name"
							children={(field) => (
								<FloatingLabelInput
									name={field.name}
									placeholder="Name"
									className="md:col-span-2"
									value={field.state.value}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									onChange={(e) => field.handleChange(e.target.value)}
									isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
									disabled={isPending}
								/>
							)}
						/>

						<form.Field
							name="country"
							children={(field) => (
								<FloatingLabelSelect
									placeholder="Country"
									name={field.name}
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value as COUNTRY)}
									disabled={isPending}
								>
									<SelectItem value="PAKISTAN">Pakistan</SelectItem>
								</FloatingLabelSelect>
							)}
						/>

						<form.Field
							name="province"
							children={(field) => (
								<FloatingLabelSelect
									placeholder="Province"
									name={field.name}
									value={field.state.value}
									onValueChange={(value) => field.handleChange(value as PROVINCE)}
									disabled={isPending}
								>
									{provinces.map((province) => (
										<SelectItem key={province} value={province} className="capitalize">
											{province.toLowerCase().split("_").join(" ")}
										</SelectItem>
									))}
								</FloatingLabelSelect>
							)}
						/>

						<form.Field
							name="address"
							children={(field) => (
								<FloatingLabelInput
									name={field.name}
									placeholder="Address"
									className="md:col-span-2"
									value={field.state.value}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									onChange={(e) => field.handleChange(e.target.value)}
									isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
									disabled={isPending}
								/>
							)}
						/>

						<form.Field
							name="city"
							children={(field) => (
								<FloatingLabelInput
									name={field.name}
									placeholder="City"
									value={field.state.value}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									onChange={(e) => field.handleChange(e.target.value)}
									isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
									disabled={isPending}
								/>
							)}
						/>

						<form.Field
							name="postalCode"
							children={(field) => (
								<FloatingLabelInput
									name={field.name}
									type="number"
									placeholder="Postal Code"
									value={field.state.value}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									onChange={(e) => field.handleChange(e.target.value)}
									isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
									disabled={isPending}
								/>
							)}
						/>

						<form.Field
							name="phone"
							children={(field) => (
								<FloatingLabelInput
									type="tel"
									name={field.name}
									placeholder="Phone"
									className="md:col-span-2"
									value={field.state.value}
									onBlur={field.handleBlur}
									errors={field.state.meta.errors}
									onChange={(e) => field.handleChange(e.target.value)}
									isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
									disabled={isPending}
								/>
							)}
						/>
					</div>
				</div>

				<div className="space-y-3">
					<h2 className="text-xl font-semibold">Shipping Method</h2>
					<div className="border-blue bg-blue/5 flex items-center justify-between rounded-md border p-3 text-sm">
						<p className="font-medium">Standard Shipping</p>
						<p>FREE</p>
					</div>
				</div>

				<div className="space-y-3">
					<h2 className="text-xl font-semibold">Payment Method</h2>
					<form.Field
						name="paymentMethod"
						children={(field) => (
							<AnimatedRadioGroup
								value={field.state.value}
								errors={field.state.meta.errors}
								onValueChange={(value) => field.handleChange(value as PAYMENT_METHOD)}
								isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
								disabled={isPending}
								items={[
									{ label: "Cash on Delivery", value: "CASH_ON_DELIVERY" },
									{
										label: "Bank Deposit",
										value: "BANK_TRANSFER",
										description: (
											<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
												<div>
													<p>Account Title: AHMAD IJAZ</p>
													<p>Bank: Meezan Bank</p>
													<p>Account # 11590112478949</p>
													<p>IBAN # PK27MEZN0011590112478949</p>
												</div>
												<div className="flex items-center justify-center">
													<Image src={QR} alt="bank qr code" width={40} height={40} className="aspect-square size-20" />
												</div>
												<div className="col-span-2">
													<p>WhatsApp Deposit Slip / Transfer Message with Your Order Number to us 0370-7525627</p>
												</div>
											</div>
										),
									},
								]}
							/>
						)}
					/>
				</div>

				<div className="space-y-3 md:hidden">
					<h2 className="text-xl font-semibold">Order Summary</h2>
					{children}
				</div>

				<Button type="submit" size="lg" className="text-base" disabled={isPending}>
					{isPending ? <Spinner /> : "Complete Order"}
				</Button>
			</form>
		</>
	);
}
