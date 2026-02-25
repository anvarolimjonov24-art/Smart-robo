import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ telegramId: string }> }) {
    try {
        const { telegramId } = await params;

        const customer = await prisma.customer.findUnique({
            where: { telegramId: BigInt(telegramId) },
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    orderBy: { createdAt: "desc" },
                    take: 5
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: customer.id,
            telegramId: customer.telegramId.toString(),
            name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
            phone: customer.phone,
            ordersCount: customer._count.orders,
            recentOrders: customer.orders
        });
    } catch (error: any) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
