"use client";
import React from 'react';
import { CreditCard, Wallet, Smartphone, ShieldCheck, Plus } from 'lucide-react';

const methods = [
    { name: "Naqd pul", provider: "Offline", status: "Aktiv", icon: <Wallet className="text-amber-500" /> },
    { name: "Click Evolution", provider: "Click LLC", status: "Aktiv", icon: <Smartphone className="text-blue-500" /> },
    { name: "Payme", provider: "Inspired LLC", status: "Ulanmagan", icon: <CreditCard className="text-cyan-500" /> },
];

export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">To'lov Turlari</h1>
                    <p className="text-gray-400 font-medium">Mijozlar uchun to'lov usullarini sozlash</p>
                </div>
                <button
                    onClick={() => alert("Yangi to'lov tizimi qo'shish...")}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-slate-100"
                >
                    <Plus size={18} />
                    <span>Yangi tizim</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {methods.map((method) => (
                    <div key={method.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                {React.cloneElement(method.icon as React.ReactElement, { size: 32 })}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${method.status === "Aktiv" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                }`}>
                                {method.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">{method.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mb-6">{method.provider}</p>

                        <button className="w-full py-3 bg-gray-50 text-slate-600 rounded-xl text-xs font-black hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-50">
                            Sozlash
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex gap-4 items-center">
                <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm">
                    <ShieldCheck size={24} />
                </div>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    Barcha onlayn to'lovlar xavfsiz protokol (SSL) va rasmiy billing tizimlari orqali amalga oshiriladi.
                    Mablag'lar to'g'ridan-to'g'ri sizning hisob raqamingizga tushadi.
                </p>
            </div>
        </div>
    );
}
