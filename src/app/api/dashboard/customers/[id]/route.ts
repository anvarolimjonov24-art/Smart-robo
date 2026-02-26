import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { customName } = await req.json();

        const customer = await prisma.customer.update({
            where: { id },
            data: { customName }
        });

        return NextResponse.json(customer);
    } catch (error: any) {
        console.error("Update customer error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
