import { NextResponse } from "next/server";
import { bot, ensureBotInitialized } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Ensure bot logic is initialized (handlers registered)
        ensureBotInitialized(bot);

        // Handle the update from Telegram
        await bot.handleUpdate(body);

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error("Webhook error:", error.message);
        // Important: Avoid returning the raw body here as it might contain BigInt 
        // which JSON.stringify doesn't support, causing a secondary 500 error.
        return NextResponse.json({
            error: error.message || "Unknown error",
            status: "error"
        }, { status: 500 });
    }
}
