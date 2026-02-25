import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const store = await prisma.store.findFirst();
        if (!store) {
            return NextResponse.json([]);
        }

        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                storeId: store.id
            },
            include: {
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Fetch products error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
