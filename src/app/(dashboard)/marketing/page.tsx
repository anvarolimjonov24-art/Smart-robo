"use client";
import React from 'react';
import { Megaphone, Zap, Target, Star, Plus } from 'lucide-react';

export default function MarketingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Marketing & CRM</h1>
                <p className="text-gray-400 font-medium">Mijozlarni jalb qilish va sodiqlik dasturlari</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Promo-kodlar", icon: <Zap />, color: "bg-amber-50 text-amber-600", count: "12 faol" },
                    { label: "Xabarnomalar", icon: <Megaphone />, color: "bg-blue-50 text-blue-600", count: "3 ta kutilmoqda" },
                    { label: "Cashback", icon: <Star />, color: "bg-emerald-50 text-emerald-600", count: "Aktiv (3%)" },
                    { label: "Segment", icon: <Target />, color: "bg-purple-50 text-purple-600", count: "5 ta guruh" },
                ].map((item) => (
                    <div key={item.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group hover:border-emerald-500/20 transition-all cursor-pointer">
                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                            {item.icon}
                        </div>
                        <h3 className="font-black text-slate-800 mb-1">{item.label}</h3>
                        <p className="text-xs font-bold text-gray-400">{item.count}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200">
                    <Megaphone size={40} />
                </div>
                <div className="max-w-xs">
                    <h3 className="text-lg font-black text-slate-800 mb-2">Yangi kampaniya boshlang</h3>
                    <p className="text-sm text-gray-400 font-medium mb-6">Mijozlarga chegirmalar yoki yangiliklar haqida xabar bering.</p>
                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-emerald-100">
                        Kampaniya yaratish
                    </button>
                </div>
            </div>
        </div>
    );
}
