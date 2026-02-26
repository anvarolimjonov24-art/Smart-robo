import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const store = await prisma.store.findFirst();
        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        return NextResponse.json({
            name: store.name,
            description: store.description || "",
            botToken: store.botToken || "",
            settings: store.settings || {},
            paymentConfig: store.paymentConfig || {}
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const store = await prisma.store.findFirst();

        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        const updatedStore = await prisma.store.update({
            where: { id: store.id },
            data: {
                name: body.name,
                description: body.description,
                botToken: body.botToken,
                settings: body.settings,
                paymentConfig: body.paymentConfig
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                name: updatedStore.name,
                description: updatedStore.description,
                botToken: updatedStore.botToken,
                settings: updatedStore.settings,
                paymentConfig: updatedStore.paymentConfig
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
