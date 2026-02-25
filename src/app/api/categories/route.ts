import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const store = await prisma.store.findFirst();
        if (!store) {
            return NextResponse.json([]);
        }

        const categories = await prisma.category.findMany({
            where: { storeId: store.id },
            orderBy: {
                name: "asc"
            }
        });

        return NextResponse.json(categories);
    } catch (error: any) {
        console.error("Fetch categories error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
