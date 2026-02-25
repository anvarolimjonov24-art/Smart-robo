import { Telegraf, Markup } from 'telegraf';
export { Markup };

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export const bot = new Telegraf(BOT_TOKEN || '');

// Helper to get Mini App buttons with proper URLs
export const getMiniAppButtons = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const miniAppUrl = `${baseUrl}/miniapp`;

    return Markup.keyboard([
        [Markup.button.webApp("🛍️ Do'kon", miniAppUrl)],
        [Markup.button.webApp("📦 Buyurtmalarim", `${miniAppUrl}/orders`)],
        [Markup.button.webApp("👤 Profil", `${miniAppUrl}/profile`)],
    ]).resize();
};

// Bot Logic & Handlers
export const initBotLogic = (botInstance: Telegraf<any>) => {
    // Global Error Handler
    botInstance.catch((err: any, ctx: any) => {
        console.error(`Bot error for ${ctx.updateType}:`, err);
    });

    // Set Menu Button (happens once per cold start or when called)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    botInstance.telegram.setChatMenuButton({
        menuButton: {
            type: 'web_app',
            text: 'Open',
            web_app: { url: `${baseUrl}/miniapp` }
        }
    }).catch(() => { });

    // Basic command handlers
    botInstance.start((ctx) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const miniAppUrl = `${baseUrl}/miniapp`;

        const welcomeMessage = `
Assalomu alaykum, ${ctx.from.first_name || 'aziz mijoz'}! 👋

🛍️ *Smart-Robo* — O'zbekistonning eng qulay onlayn robot va gadjetlar do'koniga xush kelibsiz!

Bizda robotlar, aqlli qurilmalar va turli texnika gadjetlari bor. Quyidagi tugmani bosib do'konni oching:
      `;

        const inlineKeyboard = Markup.inlineKeyboard([
            [Markup.button.webApp("🛒 Do'konni ochish", miniAppUrl)],
            [Markup.button.webApp("📦 Katalog", miniAppUrl)]
        ]);

        return ctx.replyWithMarkdown(welcomeMessage, {
            ...getMiniAppButtons(),
            reply_markup: {
                ...getMiniAppButtons().reply_markup,
                inline_keyboard: inlineKeyboard.reply_markup.inline_keyboard
            }
        });
    });

    botInstance.hears("Do'kon 🛍️", (ctx) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const miniAppUrl = `${baseUrl}/miniapp`;

        return ctx.reply("Savdo qilishni boshlash uchun quyidagi tugmani bosing:",
            Markup.inlineKeyboard([
                [Markup.button.webApp("Do'konni ochish 🛒", miniAppUrl)]
            ])
        );
    });

    botInstance.hears("Chat 💬", (ctx) => {
        return ctx.replyWithMarkdown(`
💬 *Admin bilan bog'lanish*

Sizda savollar yoki takliflar bormi? Adminimiz sizga yordam berishga tayyor!

👤 Admin: @smart_robo_admin
        `);
    });

    botInstance.hears("Mening buyurtmalarim 📦", (ctx) => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const ordersUrl = `${baseUrl}/miniapp/orders`;

        return ctx.reply("Sizning barcha buyurtmalaringiz shu yerda:",
            Markup.inlineKeyboard([
                [Markup.button.webApp("Buyurtmalarni ko'rish 📦", ordersUrl)]
            ])
        );
    });

    botInstance.hears("Tilni o'zgartirish 🌐", (ctx) => {
        return ctx.reply("Hozircha faqat O'zbek tili mavjud. Tez orada boshqa tillar ham qo'shiladi! 🇺🇿");
    });

    botInstance.command('orders', (ctx) => {
        return ctx.reply("📦 Buyurtmalaringiz ro'yxatini ko'rish uchun Do'kon elementidagi 'Profil' bo'limiga o'ting.");
    });

    botInstance.help((ctx) => {
        const helpMessage = `
❓ *Yordam kerakmi?*

Agar sizda savollar bo'lsa yoki muammoga duch kelsangiz, adminimiz bilan bog'laning:
👤 @smart_robo_admin

Dastur versiyasi: 1.2.0 (Pro)
      `;
        return ctx.replyWithMarkdown(helpMessage);
    });
};

// Global flag to prevent multiple handler registrations in the same process
let isBotInitialized = false;

export const ensureBotInitialized = (botInstance: Telegraf<any>) => {
    if (!isBotInitialized) {
        initBotLogic(botInstance);
        isBotInitialized = true;
    }
};


// Helper to send order notification to admin
export const notifyAdminNewOrder = async (chatId: string, orderData: any) => {
    const message = `
🔔 *Yangi buyurtma!* 
#ID${orderData.orderNumber}

👤 Mijoz: ${orderData.customerName}
📞 Tel: ${orderData.customerPhone}
💰 Summa: ${orderData.totalAmount} so'm
📦 Mahsulotlar: ${orderData.itemCount} ta

📍 Manzil: ${orderData.deliveryAddress || 'Bot orqali yuborilgan'}
  `;

    await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
};

// Helper to notify customer about status change
export const notifyCustomerStatusUpdate = async (chatId: number, orderId: string, status: string) => {
    const statusNames: Record<string, string> = {
        'PROCESSING': 'Tayyorlanmoqda 👨‍🍳',
        'SHIPPING': 'Yo\'lda 🚀',
        'DELIVERED': 'Yetkazib berildi ✅',
        'CANCELLED': 'Bekor qilindi ❌'
    };

    const message = `
📦 *Buyurtma holati o'zgardi!*
ID: #${orderId}

Yangi holat: *${statusNames[status] || status}*
  `;

    await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
};
