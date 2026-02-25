import asyncio
import logging
import sys
from os import getenv

from aiogram import Bot, Dispatcher, html, types
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder
from dotenv import load_dotenv

load_dotenv()

# Bot kesh va boshqa sozlamalar
TOKEN = getenv("BOT_TOKEN")
MINI_APP_URL = getenv("MINI_APP_URL")

dp = Dispatcher()

@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    """
    /start buyrug'i uchun handler
    """
    builder = InlineKeyboardBuilder()
    builder.row(types.InlineKeyboardButton(
        text="🛒 Do'konni ochish", 
        web_app=WebAppInfo(url=MINI_APP_URL))
    )
    
    markup = ReplyKeyboardBuilder()
    markup.row(types.KeyboardButton(text="🛍️ Do'kon", web_app=WebAppInfo(url=MINI_APP_URL)))
    markup.row(types.KeyboardButton(text="📦 Buyurtmalarim", web_app=WebAppInfo(url=f"{MINI_APP_URL}/orders")))
    markup.row(types.KeyboardButton(text="👤 Profil", web_app=WebAppInfo(url=f"{MINI_APP_URL}/profile")))

    await message.answer(
        f"Assalomu alaykum, {html.bold(message.from_user.full_name)}! 👋\n\n"
        f"Smart-Robo do'koniga xush kelibsiz. Bizning botimiz orqali eng so'nggi robotlar va gadjetlarni xarid qilishingiz mumkin.",
        reply_markup=markup.as_markup(resize_keyboard=True),
        parse_mode=ParseMode.HTML
    )
    
    await message.answer("Xaridni boshlash uchun quyidagi tugmani bosing:", reply_markup=builder.as_markup())

async def main() -> None:
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
