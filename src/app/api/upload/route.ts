import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Uploads papkasini tekshirish/yaratish
        const uploadDir = join(process.cwd(), "public/uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Allready exists
        }

        const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, "-")}`;
        const path = join(uploadDir, fileName);

        await writeFile(path, buffer);
        console.log(`Fayl yuklandi: ${path}`);

        const url = `/uploads/${fileName}`;
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
