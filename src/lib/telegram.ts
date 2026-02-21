import { Telegraf, Markup } from 'telegraf';
export { Markup };

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export const bot = new Telegraf(BOT_TOKEN || '');

export const getMiniAppButtons = () => {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return Markup.keyboard([
        [Markup.button.webApp("Open 🛍️", `${baseUrl}/miniapp`)],
        [Markup.button.text("Tilni o'zgartirish 🌐"), Markup.button.text("Chat 💬")],
        [Markup.button.webApp("Mening buyurtmalarim 📦", `${baseUrl}/miniapp/orders`)]
    ]).resize();
};

// Bot Logic & Handlers
export const initBotLogic = (botInstance: Telegraf<any>) => {
    // Set bot commands description for Telegram UI
    botInstance.telegram.setMyCommands([
        { command: 'start', description: 'Do\'konni ishga tushirish' },
        { command: 'orders', description: 'Buyurtmalarim' },
        { command: 'help', description: 'Yordam va qo\'llab quvvatlash' },
    ]).catch(() => { });

    // Basic command handlers
    botInstance.start((ctx) => {
        const welcomeMessage = `
👋 *Assalomu alaykum, ${ctx.from.first_name}!*

Smart-Robo do'koniga xush kelibsiz. Bizning botimiz orqali siz:
• Eng so'nggi gadjetlarni ko'rishingiz
• Onlayn buyurtma berishingiz
• Buyurtma holatini kuzatib borishingiz mumkin.

👇 *Xaridni boshlash uchun "Open 🛍️" tugmasini yoki pastdagi havolani bosing:*
      `;
        return ctx.replyWithMarkdown(welcomeMessage, getMiniAppButtons());
    });

    botInstance.hears("Open 🛍️", (ctx) => {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
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
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
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

// Initialize bot logic immediately
initBotLogic(bot);


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
