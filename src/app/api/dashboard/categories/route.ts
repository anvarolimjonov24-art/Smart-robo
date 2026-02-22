import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: {
                order: "asc"
            }
        });

        const formattedCategories = categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            productsCount: cat._count.products,
            storeId: cat.storeId
        }));

        return NextResponse.json(formattedCategories);
    } catch (error: any) {
        console.error("Fetch dashboard categories error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, storeId } = body;

        if (!name || !storeId) {
            return NextResponse.json({ error: "Kategoriya nomi va do'kon ID si kerak" }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                name,
                storeId
            }
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error("Create category error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
