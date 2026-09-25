"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheckIcon, Copy, Check, MessageCircle, Building2 } from "lucide-react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SuccessCheckoutProps {
	isLogin?: boolean;
	orderId?: string;
	paymentMethod?: "CASH_ON_DELIVERY" | "BANK_TRANSFER";
}

export default function SuccessCheckout({ isLogin, orderId, paymentMethod }: SuccessCheckoutProps) {
	const router = useRouter();
	const [open, setOpen] = useState(true);
	const [copied, setCopied] = useState(false);

	const formattedOrderId = orderId ? orderId.toUpperCase() : "";

	const handleCopy = () => {
		if (!formattedOrderId) return;
		navigator.clipboard.writeText(formattedOrderId);
		setCopied(true);
		toast.success("Order ID copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	const bankTransferWhatsappUrl = `https://wa.me/923707525627?text=${encodeURIComponent(
		`Hello Zyvorn, I have placed Order #${orderId?.toUpperCase()}. Here is my payment deposit slip:`
	)}`;

	const codWhatsappUrl = `https://wa.me/923707525627?text=${encodeURIComponent(
		`Hello Zyvorn, I have a question regarding my Order #${orderId?.toUpperCase()}`
	)}`;

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent className="max-h-[90vh] overflow-y-auto gap-5 py-8 sm:max-w-md">
				<AlertDialogHeader className="items-center gap-3 text-center">
					<div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-full border">
						<CircleCheckIcon className="size-10 text-green-600" />
					</div>
					<AlertDialogTitle className="text-2xl font-bold">Congratulations!</AlertDialogTitle>
					<AlertDialogDescription className="text-center text-sm">
						Your order has been placed successfully 🎉
					</AlertDialogDescription>
				</AlertDialogHeader>

				{formattedOrderId && (
					<div className="bg-muted/50 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm">
						<span className="text-muted-foreground font-medium">Order ID:</span>
						<div className="flex items-center gap-1.5 font-mono font-semibold">
							<span>#{formattedOrderId}</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="size-7"
								onClick={handleCopy}
								title="Copy Order ID"
							>
								{copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
							</Button>
						</div>
					</div>
				)}

				{paymentMethod === "BANK_TRANSFER" && (
					<div className="space-y-3">
						<Alert className="border-primary/20 bg-primary/5">
							<Building2 className="size-4" />
							<AlertTitle className="font-semibold">Bank Transfer Instructions</AlertTitle>
							<AlertDescription className="mt-2 space-y-1.5 text-xs text-foreground/90">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Bank:</span>
									<span className="font-medium">Bank Alfalah</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Title:</span>
									<span className="font-medium">AHMAD IJAZ</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Account #:</span>
									<span className="font-mono font-medium">03651008886488</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">IBAN:</span>
									<span className="font-mono font-medium">PK89ALFA0365001008886488</span>
								</div>
								<p className="pt-1.5 text-xs text-muted-foreground leading-normal">
									Please transfer the payment to the account above and share your deposit slip on WhatsApp with your Order ID.
								</p>
							</AlertDescription>
						</Alert>

						<Button
							asChild
							className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium shadow-xs"
						>
							<a href={bankTransferWhatsappUrl} target="_blank" rel="noopener noreferrer">
								<MessageCircle className="size-4 mr-2" />
								Send Deposit Slip on WhatsApp
							</a>
						</Button>
					</div>
				)}

				{paymentMethod === "CASH_ON_DELIVERY" && (
					<div className="space-y-3">
						<div className="bg-muted/40 rounded-lg border p-3 text-xs text-muted-foreground leading-relaxed">
							<p className="font-medium text-foreground mb-1">Cash on Delivery</p>
							<p>Your order will be paid in cash upon delivery. Please keep the exact amount ready.</p>
						</div>

						<Button
							asChild
							variant="outline"
							className="w-full text-xs"
						>
							<a href={codWhatsappUrl} target="_blank" rel="noopener noreferrer">
								<MessageCircle className="size-4 mr-2" />
								Questions? Contact us on WhatsApp
							</a>
						</Button>
					</div>
				)}

				<AlertDialogFooter className="gap-3 sm:flex-row">
					{isLogin && (
						<Button
							variant="outline"
							onClick={() => {
								router.push("/account");
								setOpen(false);
							}}
						>
							Go to account
						</Button>
					)}
					<Button
						onClick={() => {
							router.push("/");
							setOpen(false);
						}}
					>
						Continue Shopping
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
