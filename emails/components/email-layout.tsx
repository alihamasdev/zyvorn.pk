import React from "react";
import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

import { config } from "~/src/lib/config";

export interface EmailLayoutProps {
	previewText: string;
	children: React.ReactNode;
}

const { baseUrl, support } = config;
const logoUrl = `${baseUrl}/logo.png`;
const whatsappUrl = support.whatsappUrl;

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
	return (
		<Html lang="en">
			<Head />
			<Preview>{previewText}</Preview>
			<Body style={styles.main}>
				<Container style={styles.container}>
					{/* Brand Header */}
					<Section style={styles.header}>
						<Link href={baseUrl} target="_blank" rel="noopener noreferrer">
							<Img src={logoUrl} alt="Three" width="112" height="22" style={styles.logo} />
						</Link>
					</Section>

					{/* Main Content Body */}
					<Section style={styles.content}>{children}</Section>

					{/* Subtle Divider */}
					<Hr style={styles.divider} />

					{/* Footer */}
					<Section style={styles.footer}>
						<Section style={styles.footerLinksSection}>
							<Link href={baseUrl} style={styles.footerLink} target="_blank">
								Visit Store
							</Link>
							<span style={styles.footerSeparator}>•</span>
							<Link href={whatsappUrl} style={styles.footerLink} target="_blank">
								WhatsApp Support
							</Link>
							<span style={styles.footerSeparator}>•</span>
							<Link href={`${baseUrl}/collections/all`} style={styles.footerLink} target="_blank">
								Collections
							</Link>
						</Section>
						<Text style={styles.footerCopyright}>© {new Date().getFullYear()} Three. All rights reserved.</Text>
						<Text style={styles.footerDisclaimer}>You received this email because of activity on your Three account.</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

const styles: Record<string, React.CSSProperties> = {
	main: {
		backgroundColor: "#f9fafb",
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		padding: "40px 16px",
		margin: "0",
	},
	container: {
		backgroundColor: "#ffffff",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		maxWidth: "540px",
		margin: "0 auto",
		padding: "36px 32px 28px",
	},
	header: {
		textAlign: "center",
		paddingBottom: "24px",
		borderBottom: "1px solid #f3f4f6",
	},
	logo: {
		margin: "0 auto",
		display: "block",
		maxWidth: "112px",
		height: "auto",
	},
	content: {
		paddingTop: "24px",
	},
	divider: {
		borderTop: "1px solid #f3f4f6",
		margin: "32px 0 20px",
	},
	footer: {
		textAlign: "center",
	},
	footerLinksSection: {
		textAlign: "center",
		margin: "0 0 12px",
	},
	footerLink: {
		fontSize: "12px",
		color: "#6b7280",
		textDecoration: "underline",
		fontWeight: 500,
		display: "inline-block",
	},
	footerSeparator: {
		fontSize: "12px",
		color: "#d1d5db",
		margin: "0 8px",
		display: "inline-block",
	},
	footerCopyright: {
		fontSize: "12px",
		color: "#9ca3af",
		margin: "0 0 4px",
	},
	footerDisclaimer: {
		fontSize: "11px",
		color: "#9ca3af",
		margin: "0",
		lineHeight: "16px",
	},
};
