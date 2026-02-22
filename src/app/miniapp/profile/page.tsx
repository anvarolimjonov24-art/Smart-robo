"use client";
import React, { useState, useEffect } from 'react';
import { User, MapPin, Bell, Shield, LogOut, ChevronRight, Camera, Package } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

export default function ProfilePage() {
    const { user, hapticImpact } = useTelegram();
    const [stats, setStats] = useState({ ordersCount: 0, joinDate: null });

    useEffect(() => {
        if (user?.id) {
            fetchStats(user.id);
        } else {
            fetchStats("853928420"); // Demoga admin ID
        }
    }, [user]);

    const fetchStats = async (telegramId: string | number) => {
        try {
            const res = await fetch(`/api/miniapp/profile?telegramId=${telegramId}`);
            const data = await res.json();
            if (data && typeof data.ordersCount !== 'undefined') {
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const menuItems = [
        { icon: MapPin, label: 'Manzillarim', color: 'text-blue-500', bg: 'bg-blue-50' },
        { icon: Bell, label: 'Bildirishnomalar', color: 'text-orange-500', bg: 'bg-orange-50' },
        { icon: Shield, label: 'Xavfsizlik', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="p-4 space-y-6 pb-24">
            {/* User Header */}
            <div className="flex flex-col items-center py-6 space-y-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 overflow-hidden border-4 border-white shadow-xl">
                        {user?.photo_url ? (
                            <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} strokeWidth={1.5} />
                        )}
                    </div>
                    <button className="absolute -right-1 -bottom-1 w-9 h-9 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-500 border border-gray-100 active:scale-90 transition-transform">
                        <Camera size={18} />
                    </button>
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-black" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>
                        {user?.first_name} {user?.last_name || ''}
                    </h1>
                    <p className="text-xs font-bold mb-3" style={{ color: "var(--tg-theme-hint-color, #9ca3af)" }}>
                        {user?.username ? `@${user.username}` : 'Foydalanuvchi'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <Package size={14} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">{stats.ordersCount} ta xarid</span>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="space-y-3">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => hapticImpact('light')}
                        className="w-full p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform border"
                        style={{
                            backgroundColor: "var(--tg-theme-secondary-bg-color, #f8fafc)",
                            borderColor: "var(--tg-theme-section-separator-color, #f1f5f9)"
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                                <item.icon size={20} />
                            </div>
                            <span className="font-bold text-sm" style={{ color: "var(--tg-theme-text-color, #0f172a)" }}>{item.label}</span>
                        </div>
                        <ChevronRight size={18} style={{ color: "var(--tg-theme-hint-color, #d1d5db)" }} />
                    </button>
                ))}
            </div>

            <button
                onClick={() => hapticImpact('medium')}
                className="w-full p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform text-red-500 font-bold text-sm border border-red-50"
            >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <LogOut size={20} />
                </div>
                <span>Chiqish</span>
            </button>

            <div className="text-center pt-4">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Version 1.2.0 (Pro)</p>
            </div>
        </div>
    );
}
