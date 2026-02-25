"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotalFormatted, getItemCount } = useCart();
    const { hapticImpact, hapticSelection, hapticNotification, showMainButton, hideMainButton } = useTelegram();
    const router = useRouter();
    const itemCount = getItemCount();
    const totalFormatted = getTotalFormatted();

    // Telegram MainButton for checkout
    useEffect(() => {
        if (items.length > 0) {
            showMainButton(
                `Rasmiylashtirish • ${totalFormatted} so'm`,
                () => {
                    router.push("/miniapp/checkout");
                }
            );
        } else {
            hideMainButton();
        }
        return () => hideMainButton();
    }, [items, totalFormatted, showMainButton, hideMainButton, router]);

    const handleIncrement = (id: number, currentQty: number) => {
        updateQuantity(id, currentQty + 1);
        hapticSelection();
    };

    const handleDecrement = (id: number, currentQty: number) => {
        if (currentQty <= 1) {
            handleRemove(id);
            return;
        }
        updateQuantity(id, currentQty - 1);
        hapticSelection();
    };

    const handleRemove = (id: number) => {
        hapticNotification("warning");
        removeFromCart(id);
    };

    return (
        <div className="space-y-6 min-h-screen">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 border-b" style={{ borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)" }}>
                <Link
                    href="/miniapp"
                    className="p-2 rounded-xl transition-colors active:scale-90"
                    style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f1f5f9)" }}
                >
                    <ArrowLeft size={20} style={{ color: "var(--tg-theme-text-color, #0f172a)" }} />
                </Link>
                <div>
                    <h1 className="text-xl font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>Savatcha</h1>
                    {itemCount > 0 && (
                        <p className="text-xs font-bold" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                            {itemCount} ta mahsulot
                        </p>
                    )}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="py-20 text-center space-y-4 px-8">
                    <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center" style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f1f5f9)" }}>
                        <ShoppingBag size={48} style={{ color: "var(--tg-theme-hint-color, #d1d5db)" }} />
                    </div>
                    <h2 className="text-xl font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>
                        Savatchangiz bo'sh
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                        Siz hali hech narsa tanlamadingiz. Do'konga qaytib, mahsulotlarni tanlang.
                    </p>
                    <Link
                        href="/miniapp"
                        className="inline-block px-8 py-3 rounded-2xl font-black text-sm active:scale-95 transition-transform shadow-lg"
                        style={{
                            backgroundColor: "var(--tg-theme-button-color, #10b981)",
                            color: "var(--tg-theme-button-text-color, white)",
                        }}
                    >
                        Do'konga qaytish
                    </Link>
                </div>
            ) : (
                <>
                    <div className="px-4 space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-3 rounded-2xl border shadow-sm transition-all"
                                style={{
                                    backgroundColor: "var(--tg-theme-section-bg-color, var(--tg-theme-bg-color, white))",
                                    borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)",
                                }}
                            >
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f8fafc)" }} />
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-sm font-bold" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>
                                            {item.name}
                                        </h3>
                                        <p className="font-black text-sm mt-1" style={{ color: "var(--tg-theme-accent-text-color, var(--tg-theme-button-color, #10b981))" }}>
                                            {item.price} so'm
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div
                                            className="flex items-center gap-3 px-3 py-1.5 rounded-xl"
                                            style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f1f5f9)" }}
                                        >
                                            <button
                                                onClick={() => handleDecrement(item.id, item.quantity)}
                                                className="active:scale-75 transition-transform"
                                                style={{ color: "var(--tg-theme-hint-color, #64748b)" }}
                                            >
                                                <Minus size={16} strokeWidth={3} />
                                            </button>
                                            <span className="text-sm font-black w-5 text-center" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleIncrement(item.id, item.quantity)}
                                                className="active:scale-75 transition-transform"
                                                style={{ color: "var(--tg-theme-accent-text-color, var(--tg-theme-button-color, #10b981))" }}
                                            >
                                                <Plus size={16} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="p-2 rounded-xl active:scale-75 transition-transform"
                                            style={{ color: "var(--tg-theme-destructive-text-color, #ef4444)" }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom summary (fallback for non-Telegram) */}
                    <div
                        className="fixed bottom-16 left-0 right-0 p-4 border-t shadow-[0_-4px_12px_-2px_rgb(0,0,0,0.05)]"
                        style={{
                            backgroundColor: "var(--tg-theme-bg-color, white)",
                            borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm" style={{ color: "var(--tg-theme-hint-color, #64748b)" }}>Umumiy:</span>
                            <span className="text-xl font-black" style={{ color: "var(--tg-theme-accent-text-color, var(--tg-theme-button-color, #10b981))" }}>
                                {totalFormatted} so'm
                            </span>
                        </div>
                        <Link
                            href="/miniapp/checkout"
                            className="w-full h-14 rounded-2xl flex items-center justify-center font-black text-lg active:scale-95 transition-transform shadow-lg"
                            style={{
                                backgroundColor: "var(--tg-theme-button-color, #10b981)",
                                color: "var(--tg-theme-button-text-color, white)",
                            }}
                        >
                            Rasmiylashtirish
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
