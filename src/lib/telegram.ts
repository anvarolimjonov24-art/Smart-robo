import { Telegraf, Markup } from 'telegraf';
export { Markup };

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export const bot = new Telegraf(BOT_TOKEN || '');

// ─── Helper: Base URL ────────────────────────────────────────────────
const getBaseUrl = () =>
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

// ─── Helper: Reply Keyboard (pastki menyudagi doimiy tugmalar) ──────
export const getMiniAppButtons = () => {
    const miniAppUrl = `${getBaseUrl()}/miniapp`;

    return Markup.keyboard([
        [Markup.button.webApp("🛍️ Do'kon", miniAppUrl)],
        [
            Markup.button.webApp("📦 Buyurtmalarim", `${miniAppUrl}/orders`),
            Markup.button.webApp("👤 Profil", `${miniAppUrl}/profile`),
        ],
        ["💬 Yordam", "ℹ️ Biz haqimizda"],
    ]).resize();
};

// ═══════════════════════════════════════════════════════════════════════
// BOT LOGIC — Professional Handlers
// ═══════════════════════════════════════════════════════════════════════
export const initBotLogic = (botInstance: Telegraf<any>) => {

    // ─── Global Error Handler ────────────────────────────────────────
    botInstance.catch((err: any, ctx: any) => {
        console.error(`[BOT ERROR] ${ctx.updateType}:`, err);
    });

    // ─── Menu Button (Telegram chat ichidagi "Menu" tugmasi) ─────────
    botInstance.telegram.setChatMenuButton({
        menuButton: {
            type: 'web_app',
            text: "🛒 Do'kon",
            web_app: { url: `${getBaseUrl()}/miniapp` }
        }
    }).catch(() => { });

    // ═════════════════════════════════════════════════════════════════
    // /start — Asosiy xush kelibsiz xabari
    // ═════════════════════════════════════════════════════════════════
    botInstance.start(async (ctx) => {
        const miniAppUrl = `${getBaseUrl()}/miniapp`;
        const name = ctx.from.first_name || 'aziz mijoz';

        const welcomeText =
            `Assalomu alaykum, *${name}*! 👋\n\n` +
            `🤖 *Smart-Robo* do'koniga xush kelibsiz!\n\n` +
            `Robotlar, aqlli qurilmalar va gadjetlarning eng katta tanlovi.\n` +
            `Pastdagi tugmalar orqali xarid qilishingiz mumkin:\n\n` +
            `🛍️ *Do'kon* — mahsulotlarni ko'rish va xarid qilish\n` +
            `📦 *Buyurtmalarim* — buyurtmalar tarixini ko'rish\n` +
            `👤 *Profil* — shaxsiy ma'lumotlaringiz\n` +
            `💬 *Yordam* — savollaringizga javob\n\n` +
            `Yoki quyidagi tugmani bosing 👇`;

        // Birinchi: Reply keyboard (pastki doimiy tugmalar)
        await ctx.replyWithMarkdown(welcomeText, getMiniAppButtons());

        // Ikkinchi: Inline keyboard (ichki tugmalar — xabar ichida)
        await ctx.reply("⚡ Tezroq boshlash uchun:", Markup.inlineKeyboard([
            [Markup.button.webApp("🛒 Do'konni ochish", miniAppUrl)],
            [Markup.button.webApp("🔥 Yangi mahsulotlar", miniAppUrl)],
        ]));
    });

    // ═════════════════════════════════════════════════════════════════
    // 💬 Yordam tugmasi
    // ═════════════════════════════════════════════════════════════════
    botInstance.hears("💬 Yordam", async (ctx) => {
        const helpText =
            `❓ *Yordam markazi*\n\n` +
            `Quyidagi buyruqlar mavjud:\n\n` +
            `/start — Botni qayta ishga tushirish\n` +
            `/help — Yordam\n` +
            `/about — Biz haqimizda\n` +
            `/contact — Aloqa ma'lumotlari\n\n` +
            `📞 *Texnik yordam:*\n` +
            `Admin: @smart\\_robo\\_admin\n` +
            `📧 Email: support@smartrobo.uz\n\n` +
            `🕐 Ish vaqti: 09:00 — 21:00`;

        await ctx.replyWithMarkdown(helpText);
    });

    // ═════════════════════════════════════════════════════════════════
    // ℹ️ Biz haqimizda tugmasi
    // ═════════════════════════════════════════════════════════════════
    botInstance.hears("ℹ️ Biz haqimizda", async (ctx) => {
        const aboutText =
            `🤖 *Smart-Robo — Robot va gadjetlar olami*\n\n` +
            `Smart-Robo — bu O'zbekistondagi eng yirik robotlar va texnologik gadjetlar onlayn do'konidir.\n\n` +
            `📍 *Manzil:* Toshkent sh., Almazar tumani\n` +
            `📞 *Telefon:* +998 90 123 45 67\n` +
            `🌐 *Website:* smartrobo.uz\n` +
            `📱 *Instagram:* @smart_robo_uz\n\n` +
            `🚚 Yetkazib berish: O'zbekiston bo'ylab 1-3 kun\n` +
            `💳 To'lov: Naqd, Click, Payme\n` +
            `🔄 Qaytarish: 14 kun ichida\n\n` +
            `❤️ Xaridlaringiz uchun rahmat!`;

        await ctx.replyWithMarkdown(aboutText, Markup.inlineKeyboard([
            [Markup.button.url("🌐 Website", "https://smart-robo.vercel.app")],
            [Markup.button.url("📱 Instagram", "https://instagram.com/smart_robo_uz")],
        ]));
    });

    // ═════════════════════════════════════════════════════════════════
    // /help buyrug'i
    // ═════════════════════════════════════════════════════════════════
    botInstance.help(async (ctx) => {
        const miniAppUrl = `${getBaseUrl()}/miniapp`;

        const helpText =
            `📖 *Smart-Robo qo'llanmasi*\n\n` +
            `*Qanday xarid qilish kerak?*\n` +
            `1️⃣ «🛍️ Do'kon» tugmasini bosing\n` +
            `2️⃣ Mahsulotni tanlang va savatchaga qo'shing\n` +
            `3️⃣ Savatchaga o'tib, buyurtmani rasmiylashtirinng\n` +
            `4️⃣ To'lov usulini tanlang va tasdiqlang\n\n` +
            `*Buyurtma holati:*\n` +
            `🆕 Yangi — buyurtma qabul qilindi\n` +
            `👨‍🍳 Tayyorlanmoqda — yig'ilmoqda\n` +
            `🚀 Yo'lda — kuryer yetkazmoqda\n` +
            `✅ Yetkazildi — buyurtma topshirildi\n\n` +
            `Dastur versiyasi: *2.0.0 PRO*`;

        await ctx.replyWithMarkdown(helpText, Markup.inlineKeyboard([
            [Markup.button.webApp("🛍️ Do'konga o'tish", miniAppUrl)],
        ]));
    });

    // ═════════════════════════════════════════════════════════════════
    // /about buyrug'i
    // ═════════════════════════════════════════════════════════════════
    botInstance.command('about', async (ctx) => {
        return ctx.replyWithMarkdown(
            `🤖 *Smart-Robo v2.0 PRO*\n\n` +
            `O'zbekistondagi eng zamonaviy robot va gadjetlar do'koni.\n\n` +
            `📦 1000+ mahsulot\n🚚 Tezkor yetkazib berish\n💳 Qulay to'lov\n⭐ 100% asl mahsulot`,
            Markup.inlineKeyboard([
                [Markup.button.url("🌐 Website", "https://smart-robo.vercel.app")],
            ])
        );
    });

    // ═════════════════════════════════════════════════════════════════
    // /contact buyrug'i
    // ═════════════════════════════════════════════════════════════════
    botInstance.command('contact', async (ctx) => {
        return ctx.replyWithMarkdown(
            `📞 *Aloqa ma'lumotlari*\n\n` +
            `📱 Telefon: +998 90 123 45 67\n` +
            `📧 Email: support@smartrobo.uz\n` +
            `👤 Admin: @smart\\_robo\\_admin\n` +
            `📍 Manzil: Toshkent, Almazar tumani\n\n` +
            `🕐 Ish vaqti: 09:00 — 21:00 (har kuni)`
        );
    });

    // ═════════════════════════════════════════════════════════════════
    // /orders buyrug'i
    // ═════════════════════════════════════════════════════════════════
    botInstance.command('orders', async (ctx) => {
        const ordersUrl = `${getBaseUrl()}/miniapp/orders`;

        return ctx.reply(
            "📦 Barcha buyurtmalaringizni bu yerda ko'rishingiz mumkin:",
            Markup.inlineKeyboard([
                [Markup.button.webApp("📦 Buyurtmalarni ko'rish", ordersUrl)],
            ])
        );
    });

    // ═════════════════════════════════════════════════════════════════
    // Noma'lum xabarga javob
    // ═════════════════════════════════════════════════════════════════
    botInstance.on('text', async (ctx) => {
        const miniAppUrl = `${getBaseUrl()}/miniapp`;

        await ctx.replyWithMarkdown(
            `🤔 Kechirasiz, men bu xabarni tushunmadim.\n\n` +
            `Quyidagi tugmalar orqali do'konni ishlatishingiz mumkin 👇\n` +
            `Yoki /help buyrug'ini yozing.`,
            Markup.inlineKeyboard([
                [Markup.button.webApp("🛍️ Do'konga o'tish", miniAppUrl)],
            ])
        );
    });
};

// ─── Initialization guard ────────────────────────────────────────────
let isBotInitialized = false;

export const ensureBotInitialized = (botInstance: Telegraf<any>) => {
    if (!isBotInitialized) {
        initBotLogic(botInstance);
        isBotInitialized = true;
    }
};

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATION HELPERS — Admin va mijozlarga xabar yuborish
// ═══════════════════════════════════════════════════════════════════════

// Adminga yangi buyurtma haqida xabar
export const notifyAdminNewOrder = async (chatId: string, orderData: any) => {
    const message =
        `🔔 *YANGI BUYURTMA!*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📋 Buyurtma: *#${orderData.orderNumber}*\n` +
        `👤 Mijoz: ${orderData.customerName}\n` +
        `📞 Telefon: ${orderData.customerPhone}\n\n` +
        `💰 Summa: *${orderData.totalAmount} so'm*\n` +
        `📦 Mahsulotlar: ${orderData.itemCount} ta\n\n` +
        `📍 Manzil: ${orderData.deliveryAddress || 'Ko\'rsatilmagan'}\n` +
        `━━━━━━━━━━━━━━━━━━━━`;

    try {
        await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('[BOT] Admin notification failed:', err);
    }
};

// Mijozga yangi buyurtma qabul qilinganligi haqida xabar
export const notifyCustomerNewOrder = async (chatId: number | string, orderNumber: string) => {
    const message =
        `✅ *Buyurtma qabul qilindi!*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📋 Buyurtma: *#${orderNumber}*\n\n` +
        `Buyurtmangiz tez orada tayyor bo'ladi, xaridingiz uchun rahmat!\n\n` +
        `━━━━━━━━━━━━━━━━━━━━`;

    try {
        await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('[BOT] Customer order notification failed:', err);
    }
};

// Mijozga buyurtma holati o'zgargani haqida xabar
export const notifyCustomerStatusUpdate = async (chatId: number, orderId: string, status: string) => {
    const statusInfo: Record<string, { emoji: string; label: string; description: string }> = {
        'PROCESSING': {
            emoji: '👨‍🍳',
            label: 'Tayyorlanmoqda',
            description: 'Buyurtmangiz yig\'ilmoqda. Tez orada yo\'lga chiqadi!'
        },
        'SHIPPING': {
            emoji: '🚀',
            label: 'Yo\'lda',
            description: 'Kuryer buyurtmangizni yetkazib berish yo\'lida!'
        },
        'DELIVERED': {
            emoji: '✅',
            label: 'Yetkazib berildi',
            description: 'Buyurtmangiz muvaffaqiyatli topshirildi. Xaridingiz uchun rahmat!'
        },
        'CANCELLED': {
            emoji: '❌',
            label: 'Bekor qilindi',
            description: 'Buyurtma bekor qilindi. Savollar bo\'lsa, /help buyrug\'ini yozing.'
        }
    };

    const info = statusInfo[status] || { emoji: '📦', label: status, description: '' };

    const message =
        `${info.emoji} *Buyurtma holati yangilandi!*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📋 Buyurtma: *#${orderId}*\n` +
        `📊 Holat: *${info.label}*\n\n` +
        `${info.description}\n` +
        `━━━━━━━━━━━━━━━━━━━━`;

    try {
        await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('[BOT] Customer notification failed:', err);
    }
};
