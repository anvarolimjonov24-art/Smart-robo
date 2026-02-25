import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdminNewOrder } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, total, delivery, payment, address, initData, user } = body;

        // In a real app, we would validate initData and extract store/user details
        // For demonstration, we'll use a hardcoded store or look it up
        const store = await prisma.store.findFirst();
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        // 1. Create or find customer
        let customer = await prisma.customer.findUnique({
            where: { telegramId: BigInt(user.id) }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    telegramId: BigInt(user.id),
                    firstName: user.first_name,
                    lastName: user.last_name,
                    username: user.username,
                    storeId: store.id,
                }
            });
        }

        // 2. Create order
        const order = await prisma.order.create({
            data: {
                storeId: store.id,
                customerId: customer.id,
                totalAmount: total,
                paymentMethod: payment.toUpperCase(),
                deliveryAddress: address,
                status: "NEW",
                paymentStatus: "PENDING",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            },
            include: {
                items: true,
                customer: true,
            }
        });

        // 3. Notify Admin
        // In reality, store might have multiple admins or a specific chatId
        // For demo, we use the user's chatId if they are the admin, or a configured one
        if (process.env.TELEGRAM_ADMIN_CHAT_ID) {
            await notifyAdminNewOrder(process.env.TELEGRAM_ADMIN_CHAT_ID, {
                orderNumber: order.orderNumber,
                customerName: `${user.first_name} ${user.last_name || ""}`,
                customerPhone: customer.phone || "Kiritilmagan",
                totalAmount: total.toLocaleString(),
                itemCount: items.length,
                deliveryAddress: address,
            });
        }

        return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber });
    } catch (error: any) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
