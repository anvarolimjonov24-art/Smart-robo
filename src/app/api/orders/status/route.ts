import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyCustomerStatusUpdate } from "@/lib/telegram";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status } = body;

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { customer: true }
        });

        // Notify customer via Telegram
        if (order.customer.telegramId) {
            await notifyCustomerStatusUpdate(
                Number(order.customer.telegramId),
                order.orderNumber.toString(),
                status
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
