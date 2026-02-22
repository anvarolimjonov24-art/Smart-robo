import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramIdStr = searchParams.get("telegramId");

        if (!telegramIdStr) {
            return NextResponse.json({ error: "Telegram ID talab qilinadi" }, { status: 400 });
        }

        const telegramId = BigInt(telegramIdStr);

        const customer = await prisma.customer.findUnique({
            where: { telegramId }
        });

        if (!customer) {
            // No customer found = no orders
            return NextResponse.json([]);
        }

        const orders = await prisma.order.findMany({
            where: { customerId: customer.id },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedOrders = orders.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            date: o.createdAt.toISOString().split("T")[0],
            status: o.status === "NEW" ? "Yangi"
                : o.status === "PROCESSING" ? "Tayyorlanmoqda"
                    : o.status === "SHIPPING" ? "Yo'lda"
                        : o.status === "DELIVERED" ? "Yetkazildi"
                            : "Bekor qilingan",
            total: `${Number(o.totalAmount).toLocaleString()} so'm`,
            items: o.items.map(i => ({
                id: i.id,
                name: i.product?.name || "O'chirilgan mahsulot",
                quantity: i.quantity,
                price: `${Number(i.price).toLocaleString()} so'm`,
                image: i.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
            }))
        }));

        return NextResponse.json(formattedOrders);
    } catch (error: any) {
        console.error("Fetch miniapp orders error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
