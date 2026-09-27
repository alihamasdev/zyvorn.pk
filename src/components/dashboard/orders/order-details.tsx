"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { type ORDER_STATUS } from "@/lib/prisma/enums";
import { FloatingLabelSelect } from "@/components/ui/floating-label-select";
import { SelectItem } from "@/components/ui/select";

import { updateOrderStatusAction } from "./action";

type OrderDetailsProps = {
	status: ORDER_STATUS;
	orderId: string;
	statusList: string[];
};

export function OrderDetails({ status, orderId, statusList }: OrderDetailsProps) {
	const [isPending, startTransition] = useTransition();

	const handleChange = (value: ORDER_STATUS) =>
		startTransition(async () => {
			const { error } = await updateOrderStatusAction(orderId, value);
			if (error) {
				toast.error(error);
				return;
			}
			toast.success("Order status updated successfully");
		});

	return (
		<FloatingLabelSelect placeholder="Status" value={status} onValueChange={handleChange} disabled={isPending}>
			{statusList.map((status) => (
				<SelectItem key={status} value={status}>
					{status}
				</SelectItem>
			))}
		</FloatingLabelSelect>
	);
}
