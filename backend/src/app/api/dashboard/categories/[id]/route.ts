import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Kategoriya ID si topilmadi" }, { status: 400 });
        }

        // Check if there are products in this category
        const productsCount = await prisma.product.count({
            where: { categoryId: id }
        });

        if (productsCount > 0) {
            return NextResponse.json({ error: "Ushbu kategoriyada mahsulotlar mavjud. Avval ularni o'chiring." }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Delete category error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Kategoriya ID si topilmadi" }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name: body.name
            }
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error: any) {
        console.error("Update category error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
