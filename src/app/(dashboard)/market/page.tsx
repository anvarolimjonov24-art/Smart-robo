"use client";
import React from 'react';
import { Store, ShoppingCart, Star, Zap, Search } from 'lucide-react';

export default function MarketPage() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-12 rounded-[3rem] text-white relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-black mb-4 leading-tight tracking-tighter">SaaS Robo Marketplace</h1>
                    <p className="text-emerald-50/70 font-medium mb-8">
                        Loyiha mualliflaridan tayyor shablonlar va qo'shimcha plaginlar do'koni.
                        Do'koningiz imkoniyatlarini kengaytiring.
                    </p>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800/40" size={20} />
                        <input
                            type="text"
                            placeholder="Shablonlar qidirish..."
                            className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-6 py-4 outline-none placeholder:text-emerald-100/50 font-medium"
                        />
                    </div>
                </div>
                {/* Abstract Shapes */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
                <div className="absolute top-10 right-20">
                    <Store size={120} className="text-white/10 rotate-12" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { name: "Premium Food Template", price: "250,000 so'm", rating: 4.9, icon: <ShoppingCart /> },
                    { name: "Admin Pro Dashboard", price: "400,000 so'm", rating: 5.0, icon: <Zap /> },
                    { name: "Telegram Analytics Bot", price: "120,000 so'm", rating: 4.7, icon: <Star /> },
                ].map((item) => (
                    <div key={item.name} className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                        <div className="aspect-square bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 group-hover:bg-emerald-50 transition-colors">
                            {React.cloneElement(item.icon as React.ReactElement, { size: 48 })}
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-black text-slate-800 tracking-tight">{item.name}</h3>
                                <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                                    <Star size={12} fill="currentColor" />
                                    <span>{item.rating}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-lg font-black text-emerald-600">{item.price}</span>
                                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Sotib olish</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
