"use client";

import type { OrderStatus as OrderStatusEnum } from "@/lib/prisma/enums";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { changeOrderStatus } from "./action";

export function OrderStatus({ status, orderId }: { status: OrderStatusEnum; orderId: string }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2">
			<div className="space-y-2">
				<Label>Status</Label>
				<Select defaultValue={status} onValueChange={(value) => changeOrderStatus(value as OrderStatusEnum, orderId)}>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="PROCESSING">Processing</SelectItem>
						<SelectItem value="DELIVERED">Deliverd</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
