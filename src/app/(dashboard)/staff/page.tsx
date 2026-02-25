"use client";
import React from 'react';
import { UserCircle, Shield, Plus, MoreVertical } from 'lucide-react';

export default function StaffPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Xodimlar</h1>
                    <p className="text-gray-400 font-medium">Operatorlar va administratorlar boshqaruvi</p>
                </div>
                <button
                    onClick={() => alert("Yangi xodim qo'shish...")}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-emerald-100"
                >
                    <Plus size={18} />
                    <span>Xodim qo'shish</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Xodim</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Holat</th>
                            <th className="px-6 py-4 text-right">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black">A</div>
                                    <div>
                                        <p className="font-bold text-slate-800">Admin</p>
                                        <p className="text-xs text-gray-400 font-medium">admin@smart-robo.uz</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <Shield size={14} className="text-blue-500" />
                                    Administrator
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Aktiv</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-gray-300 hover:text-slate-600 transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
