import React from "react";
import { Column, Heading, Hr, Img, Row, Section, Text } from "@react-email/components";

import { config } from "@/lib/config";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { type OrderItemProp } from "./order-confirmation";

export interface OrderCancellationEmailProps {
	order?: {
		id: string;
		name: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		province: string;
		country: string;
		total: number;
		createdAt?: Date | string;
		items?: OrderItemProp[];
	};
}

const { support } = config;
const whatsappUrl = support.whatsappUrl;

const defaultOrder = {
	id: "cm1234567890abcdef",
	name: "Ali Hamza",
	email: "customer@example.com",
	phone: "03001234567",
	address: "House 42, Street 7, Block B, DHA Phase 5",
	city: "Lahore",
	province: "Punjab",
	country: "Pakistan",
	total: 5499,
	items: [
		{
			quantity: 1,
			price: 3499,
			product: {
				title: "Premium Minimalist Chrono Watch",
				images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"],
			},
		},
		{
			quantity: 2,
			price: 1000,
			product: {
				title: "Genuine Leather Card Holder",
				images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80"],
			},
		},
	],
};

export default function OrderCancellationEmail({ order = defaultOrder }: OrderCancellationEmailProps = {}) {
	const orderNumber = order.id.slice(-8).toUpperCase();

	return (
		<EmailLayout previewText={`Order #${orderNumber} Cancelled - Three`}>
			<Section style={styles.headerSection}>
				<Heading style={styles.heading}>Order Cancelled</Heading>
				<Text style={styles.descriptionText}>
					Your order <strong>#{orderNumber}</strong> has been cancelled. If you already made a payment or believe this was done in error,
					our support team is available to assist you.
				</Text>
			</Section>

			{/* Order Metadata Card */}
			<Section style={styles.metadataCard}>
				<Row>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Order Reference</Text>
						<Text style={styles.metaValue}>#{orderNumber}</Text>
					</Column>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Total</Text>
						<Text style={styles.metaValue}>Rs. {formatPrice(order.total)}</Text>
					</Column>
				</Row>
			</Section>

			{/* Cancelled Items */}
			{order.items && order.items.length > 0 ? (
				<Section style={styles.tableSection}>
					<Text style={styles.sectionTitle}>Cancelled Items</Text>
					{order.items.map((item, index) => {
						const firstImage = getProductImageUrl(item.product?.images?.[0]);
						return (
							<Row key={index} style={styles.itemRow}>
								{firstImage ? (
									<Column style={styles.itemImageCol}>
										<Img src={firstImage} alt={item.product.title} width="54" height="54" style={styles.itemThumbnail} />
									</Column>
								) : null}
								<Column style={styles.itemDetailsCol}>
									<Text style={styles.itemTitle}>{item.product.title}</Text>
									<Text style={styles.itemQty}>Qty: {item.quantity}</Text>
								</Column>
								<Column style={styles.itemPriceCol}>
									<Text style={styles.itemPrice}>Rs. {formatPrice(item.price * item.quantity)}</Text>
								</Column>
							</Row>
						);
					})}
					<Row style={styles.summaryRow}>
						<Column style={styles.summaryLabelCol}>
							<Text style={styles.summaryLabel}>Subtotal</Text>
						</Column>
						<Column style={styles.summaryValueCol}>
							<Text style={styles.summaryValue}>Rs. {formatPrice(order.total)}</Text>
						</Column>
					</Row>
					<Row style={styles.summaryRow}>
						<Column style={styles.summaryLabelCol}>
							<Text style={styles.summaryLabel}>Delivery</Text>
						</Column>
						<Column style={styles.summaryValueCol}>
							<Text style={styles.summaryValue}>Free</Text>
						</Column>
					</Row>
					<Hr style={styles.summaryDivider} />
					<Row style={styles.totalRow}>
						<Column style={styles.summaryLabelCol}>
							<Text style={styles.totalLabel}>Cancelled Total</Text>
						</Column>
						<Column style={styles.summaryValueCol}>
							<Text style={styles.totalValue}>Rs. {formatPrice(order.total)}</Text>
						</Column>
					</Row>
				</Section>
			) : null}

			{/* Contact & Support Action */}
			<Section style={styles.ctaSection}>
				<EmailButton href={whatsappUrl} variant="primary">
					Contact Support
				</EmailButton>
			</Section>
		</EmailLayout>
	);
}

const styles: Record<string, React.CSSProperties> = {
	headerSection: {
		textAlign: "center",
		paddingBottom: "24px",
	},
	heading: {
		fontSize: "22px",
		fontWeight: 600,
		color: "#111827",
		margin: "0 0 10px",
		letterSpacing: "-0.01em",
	},
	descriptionText: {
		fontSize: "14px",
		lineHeight: "22px",
		color: "#4b5563",
		margin: "0 auto",
		maxWidth: "460px",
	},
	metadataCard: {
		backgroundColor: "#f9fafb",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "18px 20px",
		margin: "0 0 28px",
	},
	colHalf: {
		width: "50%",
		verticalAlign: "top",
	},
	metaLabel: {
		fontSize: "11px",
		fontWeight: 600,
		textTransform: "uppercase",
		color: "#6b7280",
		letterSpacing: "0.06em",
		margin: "0 0 4px",
	},
	metaValue: {
		fontSize: "14px",
		fontWeight: 600,
		color: "#111827",
		margin: "0",
	},
	tableSection: {
		backgroundColor: "#ffffff",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "20px 20px 16px",
		margin: "0 0 28px",
	},
	sectionTitle: {
		fontSize: "12px",
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: "0.06em",
		color: "#6b7280",
		margin: "0 0 14px",
	},
	itemRow: {
		padding: "10px 0",
		borderBottom: "1px solid #f3f4f6",
	},
	itemImageCol: {
		width: "62px",
		verticalAlign: "middle",
	},
	itemThumbnail: {
		borderRadius: "6px",
		objectFit: "cover",
		border: "1px solid #eaeaea",
		display: "block",
	},
	itemDetailsCol: {
		verticalAlign: "middle",
		paddingLeft: "6px",
	},
	itemTitle: {
		fontSize: "13px",
		fontWeight: 500,
		color: "#111827",
		margin: "0 0 4px",
		lineHeight: "18px",
	},
	itemQty: {
		fontSize: "12px",
		color: "#6b7280",
		margin: "0",
	},
	itemPriceCol: {
		width: "90px",
		textAlign: "right",
		verticalAlign: "middle",
	},
	itemPrice: {
		fontSize: "13px",
		fontWeight: 500,
		color: "#111827",
		margin: "0",
	},
	summaryRow: {
		padding: "6px 0",
	},
	summaryLabelCol: {
		width: "60%",
	},
	summaryValueCol: {
		width: "40%",
		textAlign: "right",
	},
	summaryLabel: {
		fontSize: "13px",
		color: "#6b7280",
		margin: "4px 0 0",
	},
	summaryValue: {
		fontSize: "13px",
		color: "#111827",
		fontWeight: 500,
		margin: "4px 0 0",
	},
	summaryDivider: {
		borderTop: "1px solid #eaeaea",
		margin: "12px 0 8px",
	},
	totalRow: {
		padding: "4px 0 0",
	},
	totalLabel: {
		fontSize: "14px",
		fontWeight: 600,
		color: "#111827",
		margin: "4px 0 0",
	},
	totalValue: {
		fontSize: "15px",
		fontWeight: 700,
		color: "#111827",
		margin: "4px 0 0",
	},
	ctaSection: {
		textAlign: "center",
		margin: "32px 0 16px",
	},
};
