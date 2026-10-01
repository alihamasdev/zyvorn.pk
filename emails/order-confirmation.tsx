import React from "react";
import { Column, Heading, Hr, Img, Row, Section, Text } from "@react-email/components";

import { baseUrl } from "@/lib/config";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";

export interface OrderItemProp {
	id?: string;
	quantity: number;
	price: number;
	product: {
		id?: string;
		title: string;
		images?: string[];
		slug?: string;
	};
}

export interface OrderConfirmationEmailProps {
	order?: {
		id: string;
		name: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		province: string;
		country: string;
		postalCode?: string | null;
		paymentMethod: "CASH_ON_DELIVERY" | "BANK_TRANSFER" | string;
		total: number;
		createdAt?: Date | string;
		items: OrderItemProp[];
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
	postalCode: "54000",
	paymentMethod: "CASH_ON_DELIVERY" as const,
	total: 5499,
	createdAt: new Date(),
	items: [
		{
			id: "item_1",
			quantity: 1,
			price: 3499,
			product: {
				id: "prod_1",
				title: "Premium Minimalist Chrono Watch",
				images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"],
				slug: "premium-minimalist-chrono-watch",
			},
		},
		{
			id: "item_2",
			quantity: 2,
			price: 1000,
			product: {
				id: "prod_2",
				title: "Genuine Leather Card Holder",
				images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80"],
				slug: "genuine-leather-card-holder",
			},
		},
	],
};

export default function OrderConfirmationEmail({ order = defaultOrder }: OrderConfirmationEmailProps = {}) {
	const orderNumber = order.id.slice(-8).toUpperCase();
	const orderDate = order.createdAt
		? new Date(order.createdAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "Today";

	const paymentMethodLabel =
		order.paymentMethod === "CASH_ON_DELIVERY"
			? "Cash on Delivery"
			: order.paymentMethod === "BANK_TRANSFER"
				? "Bank Transfer"
				: order.paymentMethod;

	return (
		<EmailLayout previewText={`Order #${orderNumber} Confirmed - Three`}>
			{/* Check icon & heading with proper spacing */}
			<Section style={styles.headerSection}>
				<div style={styles.checkIconCircle}>✓</div>
				<Heading style={styles.heading}>Order Confirmed</Heading>
				<Text style={styles.subtext}>
					Thank you for your order, {order.name}. We've received your request and our team has started processing it.
				</Text>
			</Section>

			{/* Order Metadata Card */}
			<Section style={styles.metadataCard}>
				<Row style={styles.metaRow}>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Order Number</Text>
						<Text style={styles.metaValue}>#{orderNumber}</Text>
					</Column>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Order Date</Text>
						<Text style={styles.metaValue}>{orderDate}</Text>
					</Column>
				</Row>
				<Row style={{ marginTop: "14px" }}>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Payment</Text>
						<Text style={styles.metaValue}>{paymentMethodLabel}</Text>
					</Column>
					<Column style={styles.colHalf}>
						<Text style={styles.metaLabel}>Total</Text>
						<Text style={styles.metaValue}>Rs. {formatPrice(order.total)}</Text>
					</Column>
				</Row>
			</Section>

			{/* Products & Totals in Unified Table Structure */}
			<Section style={styles.tableSection}>
				<Text style={styles.sectionTitle}>Items Ordered ({order.items.length})</Text>

				{/* Product Rows */}
				{order.items.map((item, index) => {
					const firstImage = getProductImageUrl(item.product.images?.[0]);
					const itemTotal = item.price * item.quantity;

					return (
						<Row key={index} style={styles.itemRow}>
							{firstImage ? (
								<Column style={styles.itemImageCol}>
									<Img src={firstImage} alt={item.product.title} width="54" height="54" style={styles.itemThumbnail} />
								</Column>
							) : null}
							<Column style={styles.itemDetailsCol}>
								<Text style={styles.itemTitle}>{item.product.title}</Text>
								<Text style={styles.itemMeta}>
									Qty: {item.quantity} × Rs. {formatPrice(item.price)}
								</Text>
							</Column>
							<Column style={styles.itemPriceCol}>
								<Text style={styles.itemPrice}>Rs. {formatPrice(itemTotal)}</Text>
							</Column>
						</Row>
					);
				})}

				{/* Financial Summary seamlessly in same table structure */}
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

			{/* Shipping Details */}
			<Section style={styles.detailsCard}>
				<Text style={styles.sectionTitle}>Delivery Destination</Text>
				<Text style={styles.addressName}>{order.name}</Text>
				<Text style={styles.addressLine}>{order.address}</Text>
				<Text style={styles.addressLine}>
					{order.city}, {order.province} {order.postalCode || ""}
				</Text>
				<Text style={styles.contactLine}>
					Phone: <strong>{order.phone}</strong>
				</Text>
			</Section>

			{/* Action */}
			<Section style={styles.ctaSection}>
				<EmailButton href={baseUrl} variant="primary">
					Continue Shopping
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
	subtext: {
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
	metaRow: {
		margin: "0",
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
	itemMeta: {
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
	detailsCard: {
		backgroundColor: "#f9fafb",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "18px 20px",
		margin: "0 0 28px",
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
	contactLine: {
		fontSize: "12px",
		color: "#4b5563",
		margin: "8px 0 0",
	},
	ctaSection: {
		textAlign: "center",
		margin: "32px 0 16px",
	},
};
