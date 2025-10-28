import { z } from "zod";

export const checkoutSchema = z.object({
	products: z.array(
		z.object({
			productId: z.uuidv4("Invalid product ID"),
			variationId: z.uuidv4("Invalid variation ID")
		})
	),
	amount: z.number().positive(),
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	phone: z.string().min(10, "Phone number must contain 10 numbers"),
	address: z.string().min(1, "Address is required"),
	country: z.enum(["pakistan"], "Country is required"),
	province: z.enum(["PUNJAB", "SINDH", "BALOCHISTAN", "KPK"], "Province is required"),
	city: z.string().min(1, "City is required"),
	zipCode: z.string().min(1, "Zip code is required")
});
