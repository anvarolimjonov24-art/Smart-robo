"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, CreditCard, Wallet, Banknote, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";

type DeliveryMethod = "courier" | "pickup";
type PaymentMethod = "cash" | "click" | "payme";

export default function CheckoutPage() {
    const [delivery, setDelivery] = useState<DeliveryMethod>("courier");
    const [payment, setPayment] = useState<PaymentMethod>("cash");
    const [address, setAddress] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationText, setLocationText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { items, getTotalFormatted, clearCart, getTotal } = useCart();
    const { hapticSelection, hapticNotification, hapticImpact, sendData, showPopup, showMainButton, hideMainButton, setMainButtonLoading, close, user: tgUser, initData: tgInitData } = useTelegram();
    const totalFormatted = getTotalFormatted();

    // Telegram MainButton for placing order
    useEffect(() => {
        showMainButton(`Buyurtma berish • ${totalFormatted} so'm`, handlePlaceOrder);
        return () => hideMainButton();
    }, [totalFormatted, delivery, payment, address, locationText]);

    const handleDeliveryChange = (method: DeliveryMethod) => {
        setDelivery(method);
        hapticSelection();
    };

    const handlePaymentChange = (method: PaymentMethod) => {
        setPayment(method);
        hapticSelection();
    };

    const handleGetLocation = () => {
        setLocationLoading(true);
        hapticImpact("medium");

        // Try Telegram LocationManager first, then fallback to browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationText(`📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                    setLocationLoading(false);
                    hapticNotification("success");
                },
                (error) => {
                    setLocationText("Joylashuvni aniqlash imkonsiz");
                    setLocationLoading(false);
                    hapticNotification("error");
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setLocationText("Geolokatsiya qo'llab-quvvatlanmaydi");
            setLocationLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setMainButtonLoading(true);
        hapticImpact("heavy");

        try {
            const orderData = {
                items: items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.priceNum,
                })),
                total: getTotal(),
                delivery,
                payment,
                address: address || locationText,
                user: tgUser, // Use extracted user info
                initData: tgInitData, // Use extracted initData
            };

            const response = await fetch("/api/miniapp/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Xatolik yuz berdi");

            hapticNotification("success");

            showPopup(
                {
                    title: "✅ Buyurtma qabul qilindi!",
                    message: `Sizning buyurtmangiz #${result.orderNumber} muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog'lanamiz!`,
                    buttons: [{ type: "close", text: "Yopish" }],
                },
                () => {
                    clearCart();
                    close();
                }
            );
        } catch (error: any) {
            hapticNotification("error");
            alert("Xatolik: " + error.message);
        } finally {
            setIsSubmitting(false);
            setMainButtonLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 border-b" style={{ borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)" }}>
                <Link
                    href="/miniapp/cart"
                    className="p-2 rounded-xl transition-colors active:scale-90"
                    style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f1f5f9)" }}
                >
                    <ArrowLeft size={20} style={{ color: "var(--tg-theme-text-color, #0f172a)" }} />
                </Link>
                <h1 className="text-xl font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>Rasmiylashtirish</h1>
            </div>

            <div className="px-4 space-y-6">
                {/* Delivery Method */}
                <section className="space-y-3">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                        Yetkazib berish
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleDeliveryChange("courier")}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95"
                            style={{
                                borderColor: delivery === "courier" ? "var(--tg-theme-button-color, #10b981)" : "transparent",
                                backgroundColor: delivery === "courier" ? "var(--tg-theme-button-color, #10b981)10" : "var(--tg-theme-secondary-bg-color, #f1f5f9)",
                            }}
                        >
                            <span className="text-2xl">🛵</span>
                            <span className="text-xs font-black" style={{ color: delivery === "courier" ? "var(--tg-theme-button-color, #10b981)" : "var(--tg-theme-text-color, #64748b)" }}>
                                Kuryer
                            </span>
                        </button>
                        <button
                            onClick={() => handleDeliveryChange("pickup")}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95"
                            style={{
                                borderColor: delivery === "pickup" ? "var(--tg-theme-button-color, #10b981)" : "transparent",
                                backgroundColor: delivery === "pickup" ? "var(--tg-theme-button-color, #10b981)10" : "var(--tg-theme-secondary-bg-color, #f1f5f9)",
                            }}
                        >
                            <span className="text-2xl">📍</span>
                            <span className="text-xs font-black" style={{ color: delivery === "pickup" ? "var(--tg-theme-button-color, #10b981)" : "var(--tg-theme-text-color, #64748b)" }}>
                                Olib ketish
                            </span>
                        </button>
                    </div>
                </section>

                {/* Location */}
                {delivery === "courier" && (
                    <section className="space-y-3">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                            Manzil
                        </h2>
                        <button
                            onClick={handleGetLocation}
                            disabled={locationLoading}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                            style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f1f5f9)" }}
                        >
                            <div className="p-2 rounded-xl shadow-sm" style={{ backgroundColor: "var(--tg-theme-bg-color, white)" }}>
                                {locationLoading ? (
                                    <Loader2 size={20} className="animate-spin" style={{ color: "var(--tg-theme-button-color, #10b981)" }} />
                                ) : (
                                    <MapPin size={20} style={{ color: "var(--tg-theme-button-color, #10b981)" }} />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>
                                    {locationText || "Geolokatsiyani yuborish"}
                                </p>
                                <p className="text-[11px] font-medium" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                                    {locationText ? "Joylashuv aniqlandi" : "Tezroq yetkazish uchun manzilni yuboring"}
                                </p>
                            </div>
                        </button>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Kvartira, qavat, xonadon..."
                            className="w-full px-4 py-4 border-none rounded-2xl text-sm outline-none"
                            style={{
                                backgroundColor: "var(--tg-theme-secondary-bg-color, #f1f5f9)",
                                color: "var(--tg-theme-text-color, #000)",
                            }}
                        />
                    </section>
                )}

                {/* Payment Methods */}
                <section className="space-y-3">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                        To'lov turi
                    </h2>
                    <div className="space-y-2">
                        <PaymentOption
                            active={payment === "cash"}
                            icon={<Banknote />}
                            label="Naqd pul orqali"
                            onClick={() => handlePaymentChange("cash")}
                        />
                        <PaymentOption
                            active={payment === "click"}
                            icon={<CreditCard style={{ color: "var(--tg-theme-link-color, #3b82f6)" }} />}
                            label="Click Evolution"
                            onClick={() => handlePaymentChange("click")}
                        />
                        <PaymentOption
                            active={payment === "payme"}
                            icon={<Wallet style={{ color: "#06b6d4" }} />}
                            label="Payme"
                            onClick={() => handlePaymentChange("payme")}
                        />
                    </div>
                </section>
            </div>

            {/* Footer Button (fallback for non-Telegram) */}
            <div className="p-4 pt-2">
                <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-lg active:scale-95 transition-all shadow-lg disabled:opacity-50"
                    style={{
                        backgroundColor: "var(--tg-theme-button-color, #10b981)",
                        color: "var(--tg-theme-button-text-color, white)",
                    }}
                >
                    {isSubmitting ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <CheckCircle2 size={24} />
                    )}
                    <span>{isSubmitting ? "Yuborilmoqda..." : "Buyurtma berish"}</span>
                </button>
                <p className="text-[10px] text-center mt-4 leading-relaxed" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                    Buyurtma berish tugmasini bosish bilan siz bizning foydalanish shartlarimiz va maxfiylik siyosatimizga rozilik bildirasiz.
                </p>
            </div>
        </div>
    );
}

function PaymentOption({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98]"
            style={{
                borderColor: active ? "var(--tg-theme-button-color, #10b981)" : "var(--tg-theme-section-separator-color, #f1f5f9)",
                backgroundColor: active ? "var(--tg-theme-button-color, #10b981)08" : "var(--tg-theme-section-bg-color, var(--tg-theme-bg-color, white))",
            }}
        >
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: "var(--tg-theme-secondary-bg-color, #f8fafc)" }}>
                    {icon}
                </div>
                <span className="text-sm font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>{label}</span>
            </div>
            <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: active ? "var(--tg-theme-button-color, #10b981)" : "var(--tg-theme-hint-color, #d1d5db)" }}
            >
                {active && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--tg-theme-button-color, #10b981)" }} />
                )}
            </div>
        </button>
    );
}
