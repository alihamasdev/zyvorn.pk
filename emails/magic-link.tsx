import React from "react";
import { Heading, Link, Section, Text } from "@react-email/components";

import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";

export interface MagicLinkEmailProps {
	url?: string;
	email?: string;
}

export default function MagicLinkEmail({
	url = "http://localhost:3000/api/auth/verify?token=example-token-123",
	email = "user@example.com",
}: MagicLinkEmailProps = {}) {
	return (
		<EmailLayout previewText="Sign in to your Three account">
			<Heading style={styles.heading}>Sign in to Three</Heading>

			<Text style={styles.paragraph}>
				Click the link below to securely sign in to your Three account. This link is valid for 10 minutes and can only be used once.
			</Text>

			<Section style={styles.btnContainer}>
				<EmailButton href={url} variant="primary">
					Sign in
				</EmailButton>
			</Section>

			<Text style={styles.subtext}>If you didn't request this email, you can safely ignore it.</Text>

			<Section style={styles.fallbackContainer}>
				<Text style={styles.fallbackLabel}>Or copy and paste this link:</Text>
				<Link href={url} style={styles.fallbackLink}>
					{url}
				</Link>
			</Section>
		</EmailLayout>
	);
}

const styles: Record<string, React.CSSProperties> = {
	heading: {
		fontSize: "20px",
		fontWeight: 600,
		color: "#111827",
		margin: "0 0 16px",
		letterSpacing: "-0.01em",
	},
	paragraph: {
		fontSize: "14px",
		lineHeight: "22px",
		color: "#374151",
		margin: "0 0 24px",
	},
	btnContainer: {
		margin: "24px 0 28px",
	},
	subtext: {
		fontSize: "13px",
		lineHeight: "20px",
		color: "#6b7280",
		margin: "0 0 20px",
	},
	fallbackContainer: {
		borderTop: "1px solid #f3f4f6",
		paddingTop: "16px",
		marginTop: "20px",
	},
	fallbackLabel: {
		fontSize: "12px",
		color: "#9ca3af",
		margin: "0 0 4px",
	},
	fallbackLink: {
		fontSize: "12px",
		color: "#111827",
		wordBreak: "break-all",
		lineHeight: "18px",
		textDecoration: "underline",
	},
};
