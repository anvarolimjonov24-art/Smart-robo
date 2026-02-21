import { NextResponse } from "next/server";
import { bot } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Handle the update from Telegram
        await bot.handleUpdate(body);

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
