import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId");

        if (!customerId) {
            return NextResponse.json({ error: "CustomerID topilmadi" }, { status: 400 });
        }

        const messages = await prisma.message.findMany({
            where: { customerId },
            orderBy: { createdAt: "asc" }
        });

        // Convert BigInt to string for JSON serialization
        const formattedMessages = messages.map(m => ({
            ...m,
            telegramId: m.telegramId?.toString()
        }));

        return NextResponse.json(formattedMessages);
    } catch (error: any) {
        console.error("Fetch chat messages error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
