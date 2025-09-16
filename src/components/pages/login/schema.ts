import z from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "Minimum 8 charatcters required")
});

export type LoginSchema = z.infer<typeof loginSchema>;
