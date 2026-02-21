"use client";
import React from 'react';
import { Globe, Smartphone, Monitor, ShoppingBag, Plus } from 'lucide-react';

export default function PlatformsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Sotuv Kanallari</h1>
                <p className="text-gray-400 font-medium">Do'koningiz faoliyat yuritadigan platformalar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Telegram Bot", type: "Mini App", status: "Aktiv", icon: <Smartphone className="text-emerald-500" /> },
                    { name: "Web Sayt", type: "Desktop/Mobile", status: "Ulanmagan", icon: <Globe className="text-blue-500" /> },
                    { name: "SaaS Robo Market", type: "Katalog", status: "Aktiv", icon: <ShoppingBag className="text-purple-500" /> },
                ].map((platform) => (
                    <div key={platform.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                {React.cloneElement(platform.icon as React.ReactElement, { size: 28 })}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${platform.status === "Aktiv" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                }`}>
                                {platform.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">{platform.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mb-6">{platform.type}</p>
                        <button className="w-full py-3 bg-gray-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all">
                            Batafsil
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
