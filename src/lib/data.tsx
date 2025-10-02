import { Facebook, Instagram, Tiktok, WhatsApp } from "@/components/social-icons";

export const socialLinks = [
	{
		title: "WhatsApp",
		tooltip: "Chat on whatsapp",
		link: "https://api.whatsapp.com/send?phone=%2B923707525627",
		icon: <WhatsApp />
	},
	{
		title: "Facebook",
		tooltip: "Visit our facebook",
		link: "https://www.facebook.com/zyvorn.pk",
		icon: <Facebook />
	},
	{
		title: "Instagram",
		tooltip: "Follow on instagram",
		link: "https://www.instagram.com/zyvorn.pk",
		icon: <Instagram />
	},
	{
		title: "TikTok",
		tooltip: "Find us on tiktok",
		link: "https://www.tiktok.com/@zyvorn.pk",
		icon: <Tiktok />
	}
] satisfies {
	title: string;
	tooltip: string;
	link: string;
	icon: React.ReactElement;
}[];
