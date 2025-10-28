"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { createOrder } from "./action";
import { checkoutSchema } from "./schema";

export function CheckoutForm({ products, amount }: { products: { productId: string; variationId: string }[]; amount: number }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const isSingleProduct = searchParams.get("productId");

	const { clearCart } = useCartStore();

	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof checkoutSchema>>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			products,
			amount,
			name: "",
			email: "",
			phone: "",
			address: "",
			zipCode: "",
			city: "",
			country: "pakistan",
			province: "PUNJAB"
		}
	});

	async function onSubmit(data: z.infer<typeof checkoutSchema>) {
		startTransition(async () => {
			const { error } = await createOrder(data);
			if (error) {
				toast.error(error);
				return;
			}
			toast.success("Your order has been recieved");
		});
		await new Promise((res) => setTimeout(res, 3000));
		if (!isSingleProduct) {
			clearCart();
			queryClient.setQueryData(["cart-products"], []);
		}
		router.push("/");
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupAddon>
										<InputGroupText>+92</InputGroupText>
									</InputGroupAddon>
									<InputGroupInput type="number" maxLength={10} {...field} />
								</InputGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="country"
						render={() => (
							<FormItem>
								<FormLabel>Country</FormLabel>
								<Select value={"pakistan"}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="pakistan">Pakistan</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="province"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Province</FormLabel>
								<Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="PUNJAB">Punjab</SelectItem>
										<SelectItem value="SINDH">Sindh</SelectItem>
										<SelectItem value="BALOCHISTAN">Balochistan</SelectItem>
										<SelectItem value="KPK">KPK</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="zipCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Zip Code</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-3">
					<h2 className="text-left text-xl font-semibold">Shipping Method</h2>
					<FieldGroup>
						<FieldSet>
							<RadioGroup defaultValue="free-delivery">
								<FieldLabel htmlFor="cod">
									<Field orientation="horizontal" className="cursor-pointer">
										<RadioGroupItem value="free-delivery" id="cod" />
										<FieldContent>
											<FieldTitle>Free Delivery</FieldTitle>
											<FieldDescription> </FieldDescription>
										</FieldContent>
									</Field>
								</FieldLabel>
							</RadioGroup>
						</FieldSet>
					</FieldGroup>
				</div>

				<div className="space-y-3">
					<h2 className="text-left text-xl font-semibold">Payement</h2>
					<FieldGroup>
						<FieldSet>
							<RadioGroup defaultValue="cod">
								<FieldLabel htmlFor="cod-id">
									<Field orientation="horizontal" className="cursor-pointer">
										<RadioGroupItem value="cod" id="cod-id" />
										<FieldContent>
											<FieldTitle>Cash on Delievery</FieldTitle>
											<FieldDescription>Pay with cash upon delivery</FieldDescription>
										</FieldContent>
									</Field>
								</FieldLabel>
								<FieldLabel htmlFor="bank">
									<Field orientation="horizontal" className="cursor-pointer">
										<RadioGroupItem value="bank-transfer" id="bank" />
										<FieldContent>
											<FieldTitle>Bank Transfer</FieldTitle>
											<FieldDescription className="*:block">
												<span>Account Title: Ahmad Ijaz</span>
												<span>Bank: Bank Alfalah</span>
												<span>Account Number: 03651008886488</span>
												<span>IBAN: PK89ALFA0365001008886488</span>
												<br />
												<span>
													WhatsApp Deposit Slip / Transfer Message with Your Order Number to us{" "}
													<a href="https://api.whatsapp.com/send?phone=%2B923707525627" target="_blank" rel="noopener noreferrer">
														+92 370 7525627
													</a>
												</span>
											</FieldDescription>
										</FieldContent>
									</Field>
								</FieldLabel>
							</RadioGroup>
						</FieldSet>
					</FieldGroup>
				</div>
				<Button type="submit" size="lg" className="h-14 cursor-pointer font-semibold" disabled={isPending}>
					{isPending ? <LoaderIcon className="animate-spin" /> : "Complete Order"}
				</Button>
			</form>
		</Form>
	);
}
