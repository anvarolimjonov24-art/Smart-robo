import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Format for frontend
        const formattedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            category: product.category?.name || "Kategoriyasiz",
            price: `${Number(product.price).toLocaleString()} so'm`,
            stock: 99, // We don't have stock field on Product model directly, keeping it arbitrary or from variants later if needed
            status: product.isActive ? "Sotuvda" : "Tugagan",
            image: product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
            rawPrice: Number(product.price),
            isActive: product.isActive,
            categoryId: product.categoryId
        }));

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        console.error("Fetch dashboard products error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, price, image, categoryId, storeId } = body;

        // Basic validation
        if (!name || !price || !categoryId || !storeId) {
            return NextResponse.json({ error: "Barcha majburiy maydonlarni to'ldiring" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                storeId,
                isActive: true
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
