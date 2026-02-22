import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Maxsulot ID si topilmadi" }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Delete product error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Maxsulot ID si topilmadi" }, { status: 400 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                ...body,
                price: body.price ? parseFloat(body.price) : undefined
            }
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        console.error("Update product error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
