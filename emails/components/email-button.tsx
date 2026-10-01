import React from "react";
import { Button } from "@react-email/components";

export interface EmailButtonProps {
	href: string;
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "whatsapp";
	style?: React.CSSProperties;
}

export function EmailButton({ href, children, variant = "primary", style }: EmailButtonProps) {
	const variantStyle = styles[variant] || styles.primary;

	return (
		<Button href={href} target="_blank" rel="noopener noreferrer" style={{ ...variantStyle, ...style }}>
			{children}
		</Button>
	);
}

const baseButton: React.CSSProperties = {
	display: "inline-block",
	padding: "13px 28px",
	borderRadius: "8px",
	fontSize: "14px",
	fontWeight: 600,
	textAlign: "center",
	textDecoration: "none",
	cursor: "pointer",
	letterSpacing: "0.2px",
};

const styles: Record<string, React.CSSProperties> = {
	primary: {
		...baseButton,
		backgroundColor: "#09090b",
		color: "#ffffff",
		border: "1px solid #09090b",
	},
	secondary: {
		...baseButton,
		backgroundColor: "#ffffff",
		color: "#0f172a",
		border: "1px solid #e2e8f0",
	},
	whatsapp: {
		...baseButton,
		backgroundColor: "#25D366",
		color: "#ffffff",
		border: "1px solid #25D366",
	},
};
