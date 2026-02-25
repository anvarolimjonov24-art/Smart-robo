import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { telegramId, items, totalAmount, customerName, customerPhone, deliveryAddress } = body;

        // 1. Find or create customer
        let customer = await prisma.customer.findUnique({
            where: { telegramId: BigInt(telegramId) }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    telegramId: BigInt(telegramId),
                    firstName: customerName,
                    phone: customerPhone
                }
            });
        }

        // 2. Create order
        const lastOrder = await prisma.order.findFirst({
            orderBy: { orderNumber: "desc" }
        });
        const nextOrderNumber = (lastOrder?.orderNumber || 1000) + 1;

        const order = await prisma.order.create({
            data: {
                orderNumber: nextOrderNumber,
                totalAmount: totalAmount,
                status: "NEW",
                customerId: customer.id,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error("Create order error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
