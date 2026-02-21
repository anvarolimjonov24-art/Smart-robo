"use client";
import React from 'react';
import { Package, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

const mockOrders = [
    { id: '1001', date: '21.02.2026', total: '15,000,000', status: 'PROCESSING', statusUz: 'Tayyorlanmoqda' },
    { id: '1002', date: '20.02.2026', total: '2,800,000', status: 'DELIVERED', statusUz: 'Yetkazildi' },
];

export default function OrdersPage() {
    const { hapticImpact } = useTelegram();

    return (
        <div className="p-4 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>Buyurtmalarim</h1>
                <p className="text-xs font-bold" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>Barcha buyurtmalaringiz tarixi</p>
            </div>

            {mockOrders.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-50 flex items-center justify-center text-gray-200">
                        <Package size={40} />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Sizda hali buyurtmalar yo'q</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {mockOrders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => hapticImpact('light')}
                            className="p-4 rounded-2xl border flex items-center justify-between active:scale-[0.98] transition-transform"
                            style={{
                                backgroundColor: "var(--tg-theme-secondary-bg-color, #f8fafc)",
                                borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)"
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'PROCESSING' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    <Package size={22} />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>#{order.id}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Clock size={12} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400">{order.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-sm" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>{order.total} so'm</p>
                                <span className={`text-[10px] font-black ${order.status === 'PROCESSING' ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                    {order.statusUz}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
