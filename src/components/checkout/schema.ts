import { z } from "zod";

export const checkoutSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters long"),
	email: z.email("Invalid email address"),
	phone: z
		.string()
		.min(10, "Phone number must have at least 10 characters")
		.regex(/^(\+92|0)?[0-9\s-]{10,15}$/, "Please enter a valid phone number"),
	address: z.string().min(3, "Address must be at least 3 characters long"),
	city: z.string().min(3, "City must be at least 3 characters long"),
	postalCode: z.string().min(3, "Zip code must be at least 3 characters long").or(z.literal("")),
	province: z.enum(["PUNJAB", "SINDH", "BALOCHISTAN", "KHYBER_PAKHTUNKHWA", "AZAD_KASHMIR"]),
	country: z.enum(["PAKISTAN"]),
	paymentMethod: z.enum(["CASH_ON_DELIVERY", "BANK_TRANSFER"])
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
