import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { initData } = await req.json();
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token || !initData) {
            return NextResponse.json({ ok: false, error: "Missing token or initData" }, { status: 400 });
        }

        // Parse initData
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get("hash");
        urlParams.delete("hash");

        // Sort params alphabetically
        const params = Array.from(urlParams.entries())
            .map(([key, value]) => `${key}=${value}`)
            .sort()
            .join("\n");

        // Create secret key
        const secretKey = crypto
            .createHmac("sha256", "WebAppData")
            .update(token)
            .digest();

        // Calculate hash
        const calculatedHash = crypto
            .createHmac("sha256", secretKey)
            .update(params)
            .digest("hex");

        if (calculatedHash === hash) {
            // Valid data
            const userStr = urlParams.get("user");
            const user = userStr ? JSON.parse(userStr) : null;

            return NextResponse.json({ ok: true, user });
        } else {
            return NextResponse.json({ ok: false, error: "Invalid hash" }, { status: 403 });
        }
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json({ ok: false, error: "Internal Error" }, { status: 500 });
    }
}
