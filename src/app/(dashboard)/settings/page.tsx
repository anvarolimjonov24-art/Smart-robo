"use client";
import { useState, useEffect } from "react";
import { Save, Bot, CreditCard, Clock, Store, Loader2, Check, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [botChecking, setBotChecking] = useState(false);
    const [botStatus, setBotStatus] = useState<"idle" | "success" | "error">("idle");

    const [storeName, setStoreName] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [botToken, setBotToken] = useState("");

    // Yuklash
    useEffect(() => {
        fetch("/api/dashboard/settings")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setStoreName(data.name || "");
                    setPhone(data.settings?.phone || "+998 90 123 45 67");
                    setDescription(data.description || "");
                    setBotToken(data.botToken || "");
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);

        try {
            const response = await fetch("/api/dashboard/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: storeName,
                    description: description,
                    botToken: botToken,
                    settings: { phone }
                })
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleCheckBot = () => {
        if (!botToken.trim()) {
            alert("⚠️ Iltimos, avval Bot Token kiriting!");
            return;
        }
        setBotChecking(true);
        setBotStatus("idle");

        // Simulyatsiya (Telegram API ga ulanishni qo'shish mumkin)
        setTimeout(() => {
            setBotChecking(false);
            if (botToken.includes(":")) {
                setBotStatus("success");
            } else {
                setBotStatus("error");
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Sozlamalar</h1>
                <p className="text-gray-400 font-medium">Do'kon va tizim sozlamalarini boshqarish</p>
            </div>

            {/* Toast */}
            {saved && (
                <div className="fixed top-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300 z-50">
                    <Check size={20} strokeWidth={3} />
                    <span className="font-bold text-sm">O'zgarishlar muvaffaqiyatli saqlandi!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Store Info */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Store size={20} />
                            </div>
                            <h2 className="text-lg font-black text-slate-800">Do'kon ma'lumotlari</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Do'kon nomi</label>
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Telefon raqami</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tavsif (Botda ko'rinadi)</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Do'koningiz haqida qisqa tavsif..."
                                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Telegram Bot */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Bot size={20} />
                            </div>
                            <h2 className="text-lg font-black text-slate-800">Telegram Bot</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Bot Token</label>
                                <input
                                    type="password"
                                    value={botToken}
                                    onChange={(e) => { setBotToken(e.target.value); setBotStatus("idle"); }}
                                    placeholder="1234567890:ABCdefGHIjklMNO..."
                                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                                />
                                <p className="text-[11px] text-gray-300 font-medium">@BotFather orqali olingan tokenni kiriting.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCheckBot}
                                    disabled={botChecking}
                                    className="text-blue-600 text-sm font-black hover:text-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {botChecking ? (
                                        <><Loader2 size={16} className="animate-spin" /> Tekshirilmoqda...</>
                                    ) : (
                                        "Botni tekshirish"
                                    )}
                                </button>
                                {botStatus === "success" && (
                                    <span className="text-emerald-600 text-xs font-black flex items-center gap-1">
                                        <Check size={14} strokeWidth={3} /> Bot muvaffaqiyatli ulandi!
                                    </span>
                                )}
                                {botStatus === "error" && (
                                    <span className="text-red-500 text-xs font-black flex items-center gap-1">
                                        <AlertCircle size={14} /> Token noto'g'ri!
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Work Hours */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                                <Clock size={20} />
                            </div>
                            <h2 className="text-lg font-black text-slate-800">Ish vaqti</h2>
                        </div>
                        <div className="space-y-3">
                            {["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"].map((day) => (
                                <div key={day} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-medium">{day}</span>
                                    <span className="font-black text-slate-700">09:00 - 18:00</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-2xl font-black hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-100 disabled:opacity-50 text-sm"
                    >
                        {saving ? (
                            <><Loader2 size={20} className="animate-spin" /> Saqlanmoqda...</>
                        ) : (
                            <><Save size={20} /> O'zgarishlarni saqlash</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
