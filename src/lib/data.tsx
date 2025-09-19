import { Facebook, Instagram, Tiktok, WhatsApp } from "@/components/social-icons";

export const socialLinks = [
	{
		title: "WhatsApp",
		tooltip: "Chat on whatsapp",
		link: new URL("/send?phone=", "https://api.whatsapp.com"),
		icon: <WhatsApp />
	},
	{
		title: "Facebook",
		tooltip: "Visit our facebook",
		link: new URL("", "https://www.facebook.com"),
		icon: <Facebook />
	},
	{
		title: "Instagram",
		tooltip: "Follow on instagram",
		link: new URL("", "https://www.instagram.com"),
		icon: <Instagram />
	},
	{
		title: "TikTok",
		tooltip: "Find us on tiktok",
		link: new URL("", "https://www.tiktok.com"),
		icon: <Tiktok />
	}
] satisfies {
	title: string;
	tooltip: string;
	link: URL;
	icon: React.ReactElement;
}[];
