import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: { totalAmount: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedCustomers = customers.map(c => {
            const totalSpent = c.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            return {
                id: c.id,
                name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.username || "Maxfiy foydalanuvchi",
                phone: c.phone || "Kiritilmagan",
                telegramId: c.telegramId.toString(),
                ordersCount: c._count.orders,
                totalSpent: `${totalSpent.toLocaleString()} so'm`,
                status: c._count.orders > 0 ? "Aktiv" : "Yangi",
                joinDate: c.createdAt.toISOString().split("T")[0]
            };
        });

        return NextResponse.json(formattedCustomers);
    } catch (error: any) {
        console.error("Fetch dashboard customers error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
