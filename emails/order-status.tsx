import React from "react";
import { Column, Heading, Hr, Img, Row, Section, Text } from "@react-email/components";

import { baseUrl } from "@/lib/config";
import { type ORDER_STATUS } from "@/lib/prisma/enums";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { type OrderItemProp } from "./order-confirmation";

export interface OrderStatusEmailProps {
	status?: ORDER_STATUS | string;
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

export default function OrderStatusEmail({ status = "DELIVERED", order = defaultOrder }: OrderStatusEmailProps = {}) {
	const orderNumber = order.id.slice(-8).toUpperCase();

	let title = "Your order is being processed";
	let description = "We're currently preparing your items for delivery. We'll update you once your package is on its way.";
	let preview = `Update on Order #${orderNumber} - Three`;
	const isDelivered = status === "DELIVERED";

	if (status === "SHIPPED") {
		title = "Your order is on the way";
		description = "Your package has been handed over to our courier partner and is on its way to your delivery address.";
		preview = `Your Three Order #${orderNumber} is on the way`;
	} else if (status === "DELIVERED") {
		title = "Your order has been delivered";
		description = "Your package has been delivered. We hope you enjoy your purchase.";
		preview = `Your Three Order #${orderNumber} has been delivered`;
	}

	return (
		<EmailLayout previewText={preview}>
			{/* Header with check icon if delivered */}
			<Section style={styles.headerSection}>
				{isDelivered ? <div style={styles.checkIconCircle}>✓</div> : null}
				<Heading style={styles.heading}>{title}</Heading>
				<Text style={styles.descriptionText}>{description}</Text>
			</Section>

			{/* Order Metadata Card */}
			<Section style={styles.metadataCard}>
				<Row>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Order Reference</Text>
						<Text style={styles.metaValue}>#{orderNumber}</Text>
					</Column>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Total Amount</Text>
						<Text style={styles.metaValue}>Rs. {formatPrice(order.total)}</Text>
					</Column>
				</Row>
			</Section>

			{/* Delivery Destination */}
			<Section style={styles.detailsCard}>
				<Text style={styles.sectionTitle}>Delivery Destination</Text>
				<Text style={styles.addressName}>
					{order.name} • {order.phone}
				</Text>
				<Text style={styles.addressLine}>
					{order.address}, {order.city}, {order.province}
				</Text>
			</Section>

			{/* Order Items Table */}
			{order.items && order.items.length > 0 ? (
				<Section style={styles.tableSection}>
					<Text style={styles.sectionTitle}>Order Items</Text>
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
							<Text style={styles.totalLabel}>Total</Text>
						</Column>
						<Column style={styles.summaryValueCol}>
							<Text style={styles.totalValue}>Rs. {formatPrice(order.total)}</Text>
						</Column>
					</Row>
				</Section>
			) : null}

			{/* Clean CTA */}
			<Section style={styles.ctaSection}>
				<EmailButton href={baseUrl} variant="primary">
					Visit Store
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
	checkIconCircle: {
		display: "inline-block",
		width: "44px",
		height: "44px",
		lineHeight: "44px",
		borderRadius: "50%",
		backgroundColor: "#f0fdf4",
		border: "1px solid #bbf7d0",
		color: "#16a34a",
		fontSize: "22px",
		fontWeight: "bold",
		textAlign: "center",
		margin: "0 auto 16px",
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
		maxWidth: "440px",
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
	detailsCard: {
		backgroundColor: "#f9fafb",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "18px 20px",
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
	addressName: {
		fontSize: "13px",
		fontWeight: 600,
		color: "#111827",
		margin: "0 0 4px",
	},
	addressLine: {
		fontSize: "13px",
		color: "#4b5563",
		lineHeight: "20px",
		margin: "0",
	},
	tableSection: {
		backgroundColor: "#ffffff",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "20px 20px 16px",
		margin: "0 0 28px",
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
