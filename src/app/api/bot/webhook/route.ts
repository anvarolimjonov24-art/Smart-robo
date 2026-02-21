import { NextResponse } from 'next/server';
import { bot } from '@/lib/telegram';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await bot.handleUpdate(body);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
