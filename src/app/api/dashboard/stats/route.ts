import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const store = await prisma.store.findFirst();
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        const [orderCount, totalRevenue, customerCount] = await Promise.all([
            prisma.order.count({ where: { storeId: store.id } }),
            prisma.order.aggregate({
                where: { storeId: store.id, paymentStatus: "PAID" },
                _sum: { totalAmount: true }
            }),
            prisma.customer.count({ where: { storeId: store.id } })
        ]);

        return NextResponse.json({
            orders: orderCount,
            revenue: totalRevenue._sum.totalAmount || 0,
            customers: customerCount
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
