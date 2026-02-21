"use client";
import React from 'react';
import { MapPin, Phone, Clock, Plus, MoreVertical } from 'lucide-react';

export default function BranchesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Filiallar</h1>
                    <p className="text-gray-400 font-medium">Do'koningiz nuqtalari va manzillar boshqaruvi</p>
                </div>
                <button
                    onClick={() => alert("Yangi filial qo'shish...")}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-emerald-100"
                >
                    <Plus size={18} />
                    <span>Yangi filial</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { name: "Asosiy do'kon", address: "Toshkent sh., Chilonzor 1-kvartal", phone: "+998 71 123 45 67", hours: "09:00 - 18:00" },
                    { name: "Yunusobod filiali", address: "Toshkent sh., Yunusobod 4-kvartal", phone: "+998 71 987 65 43", hours: "10:00 - 20:00" },
                ].map((branch) => (
                    <div key={branch.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                <MapPin size={24} className="text-emerald-500" />
                            </div>
                            <button className="p-2 text-gray-300 hover:text-slate-600 transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">{branch.name}</h3>
                        <p className="text-sm text-gray-400 font-medium mb-4">{branch.address}</p>

                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <Phone size={14} className="text-gray-300" />
                                <span>{branch.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <Clock size={14} className="text-gray-300" />
                                <span>Ish vaqti: {branch.hours}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
