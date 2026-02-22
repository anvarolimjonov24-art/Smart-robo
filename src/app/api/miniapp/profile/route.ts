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
            where: { telegramId },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ ordersCount: 0, joinDate: null });
        }

        return NextResponse.json({
            ordersCount: customer._count.orders,
            joinDate: customer.createdAt.toISOString().split("T")[0]
        });
    } catch (error: any) {
        console.error("Fetch profile stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
