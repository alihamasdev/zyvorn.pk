import React from "react";
import { Column, Heading, Hr, Img, Row, Section, Text } from "@react-email/components";

import { baseUrl } from "@/lib/config";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { type OrderConfirmationEmailProps } from "./order-confirmation";

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
				title: "Premium Minimalist Chrono Watch",
				images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"],
			},
		},
		{
			id: "item_2",
			quantity: 2,
			price: 1000,
			product: {
				title: "Genuine Leather Card Holder",
				images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80"],
			},
		},
	],
};

export default function AdminOrderAlertEmail({ order = defaultOrder }: OrderConfirmationEmailProps = {}) {
	const orderNumber = order.id.slice(-8).toUpperCase();
	const cleanPhone = order.phone.replace(/[\s-]/g, "");
	const customerWa = `https://wa.me/92${cleanPhone.replace(/^0/, "")}`;
	const dashboardUrl = `${baseUrl}/dashboard/orders`;

	return (
		<EmailLayout previewText={`New Order #${orderNumber} received - Three`}>
			<Section style={styles.alertHeader}>
				<Heading style={styles.heading}>New Order #{orderNumber}</Heading>
				<Text style={styles.subheading}>
					A new order of <strong>Rs. {formatPrice(order.total)}</strong> was placed by {order.name}.
				</Text>
			</Section>

			{/* Quick Actions */}
			<Section style={styles.actionsBox}>
				<Row>
					<Column style={styles.actionColLeft}>
						<EmailButton href={dashboardUrl} variant="primary" style={styles.actionBtn}>
							Open Dashboard
						</EmailButton>
					</Column>
					<Column style={styles.actionColRight}>
						<EmailButton href={customerWa} variant="secondary" style={styles.actionBtn}>
							WhatsApp Customer
						</EmailButton>
					</Column>
				</Row>
			</Section>

			{/* Customer Details */}
			<Section style={styles.card}>
				<Text style={styles.cardTitle}>Customer Information</Text>
				<Row style={styles.infoRow}>
					<Column style={styles.infoCol}>
						<Text style={styles.fieldLabel}>Name</Text>
						<Text style={styles.fieldValue}>{order.name}</Text>
					</Column>
					<Column style={styles.infoCol}>
						<Text style={styles.fieldLabel}>Phone</Text>
						<Text style={styles.fieldValue}>{order.phone}</Text>
					</Column>
				</Row>
				<Row style={styles.infoRow}>
					<Column style={styles.infoCol}>
						<Text style={styles.fieldLabel}>Email</Text>
						<Text style={styles.fieldValue}>{order.email}</Text>
					</Column>
					<Column style={styles.infoCol}>
						<Text style={styles.fieldLabel}>Payment</Text>
						<Text style={styles.fieldValue}>{order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Bank Transfer"}</Text>
					</Column>
				</Row>
				<Row style={styles.addressRow}>
					<Column>
						<Text style={styles.fieldLabel}>Address</Text>
						<Text style={styles.fieldValue}>
							{order.address}, {order.city}, {order.province}
						</Text>
					</Column>
				</Row>
			</Section>

			{/* Items & Totals in Unified Table Structure */}
			<Section style={styles.tableSection}>
				<Text style={styles.cardTitle}>Items Ordered ({order.items.length})</Text>
				{order.items.map((item, index) => {
					const firstImage = getProductImageUrl(item.product.images?.[0]);
					return (
						<Row key={index} style={styles.itemRow}>
							{firstImage ? (
								<Column style={styles.itemImageCol}>
									<Img src={firstImage} alt={item.product.title} width="48" height="48" style={styles.itemThumbnail} />
								</Column>
							) : null}
							<Column style={styles.itemDetailsCol}>
								<Text style={styles.itemTitle}>{item.product.title}</Text>
								<Text style={styles.itemMeta}>
									Qty: {item.quantity} x Rs. {formatPrice(item.price)}
								</Text>
							</Column>
							<Column style={styles.itemPriceCol}>
								<Text style={styles.itemTotal}>Rs. {formatPrice(item.price * item.quantity)}</Text>
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
				<Hr style={styles.divider} />
				<Row style={styles.totalRow}>
					<Column style={styles.summaryLabelCol}>
						<Text style={styles.totalLabel}>Total</Text>
					</Column>
					<Column style={styles.summaryValueCol}>
						<Text style={styles.totalValue}>Rs. {formatPrice(order.total)}</Text>
					</Column>
				</Row>
			</Section>
		</EmailLayout>
	);
}

const styles: Record<string, React.CSSProperties> = {
	alertHeader: {
		textAlign: "center",
		paddingBottom: "18px",
	},
	heading: {
		fontSize: "22px",
		fontWeight: 600,
		color: "#111827",
		margin: "0 0 6px",
		letterSpacing: "-0.01em",
	},
	subheading: {
		fontSize: "14px",
		color: "#4b5563",
		margin: "0",
	},
	actionsBox: {
		margin: "0 0 24px",
	},
	actionColLeft: {
		textAlign: "center",
		paddingRight: "6px",
	},
	actionColRight: {
		textAlign: "center",
		paddingLeft: "6px",
	},
	actionBtn: {
		padding: "11px 16px",
		fontSize: "13px",
		display: "block",
		width: "100%",
		boxSizing: "border-box",
	},
	card: {
		backgroundColor: "#f9fafb",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "18px 20px",
		margin: "0 0 24px",
	},
	cardTitle: {
		fontSize: "12px",
		fontWeight: 600,
		color: "#6b7280",
		textTransform: "uppercase",
		letterSpacing: "0.06em",
		margin: "0 0 14px",
	},
	infoRow: {
		marginBottom: "10px",
	},
	addressRow: {
		marginTop: "10px",
	},
	infoCol: {
		width: "50%",
		verticalAlign: "top",
	},
	fieldLabel: {
		fontSize: "11px",
		fontWeight: 600,
		color: "#6b7280",
		textTransform: "uppercase",
		letterSpacing: "0.04em",
		margin: "0 0 2px",
	},
	fieldValue: {
		fontSize: "13px",
		color: "#111827",
		margin: "0",
	},
	tableSection: {
		backgroundColor: "#ffffff",
		border: "1px solid #eaeaea",
		borderRadius: "8px",
		padding: "18px 20px 14px",
		margin: "0 0 24px",
	},
	itemRow: {
		padding: "8px 0",
		borderBottom: "1px solid #f3f4f6",
	},
	itemImageCol: {
		width: "56px",
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
		margin: "0 0 2px",
	},
	itemMeta: {
		fontSize: "12px",
		color: "#6b7280",
		margin: "0",
	},
	itemPriceCol: {
		textAlign: "right",
		width: "90px",
	},
	itemTotal: {
		fontSize: "13px",
		fontWeight: 500,
		color: "#111827",
		margin: "0",
	},
	summaryRow: {
		padding: "6px 0",
	},
	divider: {
		borderTop: "1px solid #eaeaea",
		margin: "12px 0 8px",
	},
	totalRow: {
		padding: "4px 0 0",
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
};
