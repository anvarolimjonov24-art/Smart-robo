import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedOrders = orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customer: order.customer ? `${order.customer.firstName} ${order.customer.lastName || ""}` : "Noma'lum",
            product: order.items.length > 0 ? (order.items[0]?.product?.name || "Mahsulot") : "Mahsulotlar",
            amount: `${order.totalAmount.toLocaleString()} so'm`,
            status: order.status,
            date: order.createdAt.toISOString().split("T")[0]
        }));

        return NextResponse.json(formattedOrders);
    } catch (error: any) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
