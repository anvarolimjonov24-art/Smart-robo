import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all active products
        const products = await prisma.product.findMany({
            where: {
                isActive: true
            },
            include: {
                category: true
            }
        });

        // Format products for Mini App
        const formattedProducts = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price).toLocaleString(),
            priceNum: Number(p.price),
            image: p.image || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300",
            category: p.category?.name || "Boshqa"
        }));

        // Extract unique categories
        const categories = ["Barchasi", ...new Set(formattedProducts.map((p: any) => p.category))];

        return NextResponse.json({
            products: formattedProducts,
            categories
        });
    } catch (error: any) {
        console.error("Fetch products error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
