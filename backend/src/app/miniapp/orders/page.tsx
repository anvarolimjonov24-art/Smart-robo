"use client";
import React, { useState, useEffect } from 'react';
import { Package, Clock, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

export default function OrdersPage() {
    const { user, hapticImpact } = useTelegram();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchOrders(user.id);
        } else {
            // Agar lokal ishlayotgan bo'lsa (Telegramdan tashqari)
            const demoId = "853928420"; // Test ID (masalan admin)
            fetchOrders(demoId);
        }
    }, [user]);

    const fetchOrders = async (telegramId: string | number) => {
        try {
            const res = await fetch(`/api/miniapp/orders?telegramId=${telegramId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>Buyurtmalarim</h1>
                <p className="text-xs font-bold" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>Barcha buyurtmalaringiz tarixi</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : orders.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100/50">
                        <Package size={40} />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Sizda hali buyurtmalar yo'q</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => hapticImpact('light')}
                            className="p-4 rounded-2xl border flex flex-col gap-3 active:scale-[0.98] transition-transform shadow-sm"
                            style={{
                                backgroundColor: "var(--tg-theme-secondary-bg-color, #ffffff)",
                                borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)"
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.status === 'Tayyorlanmoqda' || order.status === 'Yangi' ? 'bg-amber-50 text-amber-500 border border-amber-100/50' :
                                            order.status === 'Yetkazildi' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100/50' :
                                                order.status === 'Yo\'lda' ? 'bg-blue-50 text-blue-500 border border-blue-100/50' :
                                                    'bg-red-50 text-red-500 border border-red-100/50'
                                        }`}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[13px]" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>Buyurtma #{order.orderNumber}</h4>
                                        <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                                            <Clock size={10} style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }} />
                                            <span className="text-[10px] font-bold" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>{order.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-sm" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>{order.total}</p>
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${order.status === 'Tayyorlanmoqda' || order.status === 'Yangi' ? 'text-amber-500' :
                                            order.status === 'Yetkazildi' ? 'text-emerald-500' :
                                                order.status === 'Yo\'lda' ? 'text-blue-500' :
                                                    'text-red-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items Preview */}
                            {order.items && order.items.length > 0 && (
                                <div className="pt-3 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)" }}>
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg p-1.5 px-2">
                                            <img src={item.image} alt="" className="w-5 h-5 rounded object-cover" />
                                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">{item.name}</span>
                                            <span className="text-[10px] font-black text-slate-400 bg-white px-1.5 rounded">{item.quantity}x</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
