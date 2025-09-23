import { Facebook, Instagram, Tiktok, WhatsApp } from "@/components/social-icons";

export const socialLinks = [
	{
		title: "WhatsApp",
		tooltip: "Chat on whatsapp",
		link: "https://api.whatsapp.com/send?phone=",
		icon: <WhatsApp />
	},
	{
		title: "Facebook",
		tooltip: "Visit our facebook",
		link: "https://www.facebook.com",
		icon: <Facebook />
	},
	{
		title: "Instagram",
		tooltip: "Follow on instagram",
		link: "https://www.instagram.com",
		icon: <Instagram />
	},
	{
		title: "TikTok",
		tooltip: "Find us on tiktok",
		link: "https://www.tiktok.com",
		icon: <Tiktok />
	}
] satisfies {
	title: string;
	tooltip: string;
	link: string;
	icon: React.ReactElement;
}[];
