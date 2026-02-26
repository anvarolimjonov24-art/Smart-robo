import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bot } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const { customerId, text, storeId } = await req.json();

        if (!customerId || !text) {
            return NextResponse.json({ error: "Ma'lumotlar yetarli emas" }, { status: 400 });
        }

        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer || !customer.telegramId) {
            return NextResponse.json({ error: "Mijoz topilmadi yoki Telegram ID yo'q" }, { status: 404 });
        }

        // 1. Telegram orqali yuborish
        try {
            await bot.telegram.sendMessage(customer.telegramId.toString(), text);
        } catch (err: any) {
            console.error("Telegram send error:", err);
            return NextResponse.json({ error: "Telegramga xabar yuborib bo'lmadi" }, { status: 500 });
        }

        // 2. Bazaga saqlash
        const message = await prisma.message.create({
            data: {
                text,
                sender: "ADMIN",
                customerId,
                storeId,
                telegramId: customer.telegramId
            }
        });

        return NextResponse.json({ ...message, telegramId: message.telegramId?.toString() });
    } catch (error: any) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
