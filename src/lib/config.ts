function getBaseUrl(): string {
	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}

function getWhatsappUrl(number?: string): string {
	const raw = number || "03707525627";
	const phone = raw.replace(/[\s-]/g, "");
	return `https://wa.me/92${phone.replace(/^0/, "")}`;
}

const resolvedBaseUrl = getBaseUrl();

export const config = {
	name: "Three",
	domain: "three.pk",
	baseUrl: resolvedBaseUrl,
	support: {
		email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
		phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE,
		whatsappUrl: getWhatsappUrl(process.env.NEXT_PUBLIC_SUPPORT_PHONE),
	},
} as const;

export const baseUrl = config.baseUrl;
