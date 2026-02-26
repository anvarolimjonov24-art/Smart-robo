import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function GET() {
    try {
        const store = await prisma.store.findFirst();
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        // 1. Umumiy statistika
        const [orderCount, totalRevenue, customerCount] = await Promise.all([
            prisma.order.count({ where: { storeId: store.id } }),
            prisma.order.aggregate({
                where: { storeId: store.id, paymentStatus: "PAID" },
                _sum: { totalAmount: true }
            }),
            prisma.customer.count({ where: { storeId: store.id } })
        ]);

        // 2. Grafiklar uchun so'nggi 7 kunlik ma'lumot
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const start = startOfDay(date);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

            const [dayRevenue, dayOrders] = await Promise.all([
                prisma.order.aggregate({
                    where: {
                        storeId: store.id,
                        paymentStatus: "PAID",
                        createdAt: { gte: start, lt: end }
                    },
                    _sum: { totalAmount: true }
                }),
                prisma.order.count({
                    where: {
                        storeId: store.id,
                        createdAt: { gte: start, lt: end }
                    }
                })
            ]);

            chartData.push({
                name: format(date, "dd MMM"),
                revenue: Number(dayRevenue._sum.totalAmount || 0),
                orders: dayOrders
            });
        }

        return NextResponse.json({
            stats: {
                orders: orderCount,
                revenue: Number(totalRevenue._sum.totalAmount || 0),
                customers: customerCount
            },
            chartData
        });
    } catch (error: any) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
