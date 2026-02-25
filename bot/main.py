import asyncio
import logging
import sys
from os import getenv

from aiogram import Bot, Dispatcher, html, types, F, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, WebAppInfo, MenuButtonWebApp
from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder
from dotenv import load_dotenv

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────
TOKEN = getenv("BOT_TOKEN")
MINI_APP_URL = getenv("MINI_APP_URL", "https://smart-robo.vercel.app/miniapp")
API_URL = getenv("API_URL", "http://localhost:3000/api")

dp = Dispatcher()
router = Router()


# ─── Reply Keyboard (pastki doimiy menyusi) ───────────────────────────
def get_main_keyboard():
    """Professional pastki menyu — WebApp tugmalari bilan"""
    kb = ReplyKeyboardBuilder()
    kb.row(types.KeyboardButton(text="🛍️ Do'kon", web_app=WebAppInfo(url=MINI_APP_URL)))
    kb.row(
        types.KeyboardButton(text="📦 Buyurtmalarim", web_app=WebAppInfo(url=f"{MINI_APP_URL}/orders")),
        types.KeyboardButton(text="👤 Profil", web_app=WebAppInfo(url=f"{MINI_APP_URL}/profile")),
    )
    kb.row(
        types.KeyboardButton(text="💬 Yordam"),
        types.KeyboardButton(text="ℹ️ Biz haqimizda"),
    )
    return kb.as_markup(resize_keyboard=True)


# ═══════════════════════════════════════════════════════════════════════
# /start — Asosiy xush kelibsiz xabari
# ═══════════════════════════════════════════════════════════════════════
@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    name = html.bold(message.from_user.full_name)

    welcome = (
        f"Assalomu alaykum, {name}! 👋\n\n"
        f"🤖 <b>Smart-Robo</b> do'koniga xush kelibsiz!\n\n"
        f"Robotlar, aqlli qurilmalar va gadjetlarning eng katta tanlovi.\n"
        f"Pastdagi tugmalar orqali xarid qilishingiz mumkin:\n\n"
        f"🛍️ <b>Do'kon</b> — mahsulotlarni ko'rish va xarid qilish\n"
        f"📦 <b>Buyurtmalarim</b> — buyurtmalar tarixini ko'rish\n"
        f"👤 <b>Profil</b> — shaxsiy ma'lumotlaringiz\n"
        f"💬 <b>Yordam</b> — savollaringizga javob\n\n"
        f"Yoki quyidagi tugmani bosing 👇"
    )

    await message.answer(welcome, reply_markup=get_main_keyboard())

    # Inline keyboard — xabar ichidagi tugma
    inline_kb = InlineKeyboardBuilder()
    inline_kb.row(types.InlineKeyboardButton(
        text="🛒 Do'konni ochish",
        web_app=WebAppInfo(url=MINI_APP_URL)
    ))
    inline_kb.row(types.InlineKeyboardButton(
        text="🔥 Yangi mahsulotlar",
        web_app=WebAppInfo(url=MINI_APP_URL)
    ))

    await message.answer("⚡ Tezroq boshlash uchun:", reply_markup=inline_kb.as_markup())


# ═══════════════════════════════════════════════════════════════════════
# /help buyrug'i
# ═══════════════════════════════════════════════════════════════════════
@router.message(Command("help"))
async def cmd_help(message: Message) -> None:
    help_text = (
        "📖 <b>Smart-Robo qo'llanmasi</b>\n\n"
        "<b>Qanday xarid qilish kerak?</b>\n"
        "1️⃣ «🛍️ Do'kon» tugmasini bosing\n"
        "2️⃣ Mahsulotni tanlang va savatchaga qo'shing\n"
        "3️⃣ Savatchaga o'tib, buyurtmani rasmiylashtirinng\n"
        "4️⃣ To'lov usulini tanlang va tasdiqlang\n\n"
        "<b>Buyurtma holati:</b>\n"
        "🆕 Yangi — buyurtma qabul qilindi\n"
        "👨‍🍳 Tayyorlanmoqda — yig'ilmoqda\n"
        "🚀 Yo'lda — kuryer yetkazmoqda\n"
        "✅ Yetkazildi — buyurtma topshirildi\n\n"
        "Dastur versiyasi: <b>2.0.0 PRO</b>"
    )

    inline_kb = InlineKeyboardBuilder()
    inline_kb.row(types.InlineKeyboardButton(
        text="🛍️ Do'konga o'tish",
        web_app=WebAppInfo(url=MINI_APP_URL)
    ))

    await message.answer(help_text, reply_markup=inline_kb.as_markup())


# ═══════════════════════════════════════════════════════════════════════
# /about buyrug'i
# ═══════════════════════════════════════════════════════════════════════
@router.message(Command("about"))
async def cmd_about(message: Message) -> None:
    about_text = (
        "🤖 <b>Smart-Robo v2.0 PRO</b>\n\n"
        "O'zbekistondagi eng zamonaviy robot va gadjetlar do'koni.\n\n"
        "📦 1000+ mahsulot\n"
        "🚚 Tezkor yetkazib berish\n"
        "💳 Qulay to'lov\n"
        "⭐ 100% asl mahsulot"
    )

    inline_kb = InlineKeyboardBuilder()
    inline_kb.row(types.InlineKeyboardButton(text="🌐 Website", url="https://smart-robo.vercel.app"))

    await message.answer(about_text, reply_markup=inline_kb.as_markup())


# ═══════════════════════════════════════════════════════════════════════
# /contact buyrug'i
# ═══════════════════════════════════════════════════════════════════════
@router.message(Command("contact"))
async def cmd_contact(message: Message) -> None:
    contact_text = (
        "📞 <b>Aloqa ma'lumotlari</b>\n\n"
        "📱 Telefon: +998 90 123 45 67\n"
        "📧 Email: support@smartrobo.uz\n"
        "👤 Admin: @smart_robo_admin\n"
        "📍 Manzil: Toshkent, Almazar tumani\n\n"
        "🕐 Ish vaqti: 09:00 — 21:00 (har kuni)"
    )

    await message.answer(contact_text)


# ═══════════════════════════════════════════════════════════════════════
# /orders buyrug'i
# ═══════════════════════════════════════════════════════════════════════
@router.message(Command("orders"))
async def cmd_orders(message: Message) -> None:
    inline_kb = InlineKeyboardBuilder()
    inline_kb.row(types.InlineKeyboardButton(
        text="📦 Buyurtmalarni ko'rish",
        web_app=WebAppInfo(url=f"{MINI_APP_URL}/orders")
    ))

    await message.answer(
        "📦 Barcha buyurtmalaringizni bu yerda ko'rishingiz mumkin:",
        reply_markup=inline_kb.as_markup()
    )


# ═══════════════════════════════════════════════════════════════════════
# 💬 Yordam tugmasi (text handler)
# ═══════════════════════════════════════════════════════════════════════
@router.message(F.text == "💬 Yordam")
async def btn_help(message: Message) -> None:
    await cmd_help(message)


# ═══════════════════════════════════════════════════════════════════════
# ℹ️ Biz haqimizda tugmasi (text handler)
# ═══════════════════════════════════════════════════════════════════════
@router.message(F.text == "ℹ️ Biz haqimizda")
async def btn_about(message: Message) -> None:
    await cmd_about(message)


# ═══════════════════════════════════════════════════════════════════════
# Noma'lum xabarga javob
# ═══════════════════════════════════════════════════════════════════════
@router.message()
async def unknown_message(message: Message) -> None:
    inline_kb = InlineKeyboardBuilder()
    inline_kb.row(types.InlineKeyboardButton(
        text="🛍️ Do'konga o'tish",
        web_app=WebAppInfo(url=MINI_APP_URL)
    ))

    await message.answer(
        "🤔 Kechirasiz, men bu xabarni tushunmadim.\n\n"
        "Quyidagi tugmalar orqali do'konni ishlatishingiz mumkin 👇\n"
        "Yoki /help buyrug'ini yozing.",
        reply_markup=inline_kb.as_markup()
    )


# ═══════════════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════
async def main() -> None:
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

    # Menu Button — chat ichidagi "Menu" tugmasi
    try:
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="🛒 Do'kon", web_app=WebAppInfo(url=MINI_APP_URL))
        )
    except Exception:
        pass

    # Bot commands ro'yxatini o'rnatish
    await bot.set_my_commands([
        types.BotCommand(command="start", description="Botni ishga tushirish"),
        types.BotCommand(command="help", description="Yordam"),
        types.BotCommand(command="orders", description="Buyurtmalarim"),
        types.BotCommand(command="about", description="Biz haqimizda"),
        types.BotCommand(command="contact", description="Aloqa"),
    ])

    dp.include_router(router)
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
