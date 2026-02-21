"use client";
import React from 'react';
import { MessageSquare, Search, Phone, CheckCheck } from 'lucide-react';

export default function ChatPage() {
    return (
        <div className="h-[calc(100vh-120px)] flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="w-80 border-r border-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                            type="text"
                            placeholder="Mijozni qidirish..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {[
                        { name: "Ali Valiyev", msg: "Buyurtmam qachon keladi?", time: "12:45", active: true },
                        { name: "Zilola Ergasheva", msg: "Rahmat, mahsulot yoqdi!", time: "11:20", active: false },
                    ].map((chat) => (
                        <div key={chat.name} className={`p-3 rounded-2xl cursor-pointer transition-colors ${chat.active ? "bg-emerald-50" : "hover:bg-gray-50"}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-black text-slate-800">{chat.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold">{chat.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 truncate font-medium">{chat.msg}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/30">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 shadow-sm mb-4">
                    <MessageSquare size={40} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Suhbatni tanlang</h3>
                <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                    Mijozlar bilan jonli muloqot qilish uchun chap tomondagi ro'yxatdan birini tanlang.
                </p>
            </div>
        </div>
    );
}
