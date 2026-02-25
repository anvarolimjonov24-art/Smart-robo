import { bot } from '../src/lib/telegram';

/**
 * Bu script faqat lokal test qilish (polling) uchun mo'ljallangan.
 * Serverda (Vercel) bot Webhook rejimida ishlaydi.
 */

// Launch the bot for local polling
bot.launch()
    .then(() => {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        console.log('-------------------------------------------');
        console.log('🚀 Smart-Robo PRO Bot (POLLING) ishga tushdi!');
        console.log(`🔗 Mini App URL: ${baseUrl}/miniapp`);

        if (baseUrl.includes('localhost')) {
            console.warn('⚠️ DIQQAT: localhost orqali Telegram "Open" tugmasi ishlamasligi mumkin.');
            console.warn('💡 Maslahat: ngrok yoki haqiqiy domendan foydalaning (HTTPS zarur).');
        }

        // Set Menu Button
        bot.telegram.setChatMenuButton({
            menuButton: {
                type: 'web_app',
                text: 'Open',
                web_app: { url: `${baseUrl}/miniapp` }
            }
        }).then(() => {
            console.log('✅ Menu Button (Open) sozlandi.');
        }).catch(() => { });

        console.log('✅ Bot xabarlarni qabul qilishga tayyor.');
        console.log('-------------------------------------------');
    })
    .catch(err => {
        console.error('❌ Bot launch xatosi:', err.message);
        if (err.message.includes('409: Conflict')) {
            console.error('💡 Maslahat: Boshqa bot jarayoni ishlayapti yoki Webhook yoqilgan.');
        }
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
