"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Filter, Phone, MoreVertical, Loader2, Edit2, Check, X, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/dashboard/customers");
            const data = await res.json();
            if (Array.isArray(data)) setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async (id: string) => {
        try {
            const res = await fetch(`/api/dashboard/customers/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customName: tempName })
            });
            if (res.ok) {
                setCustomers(customers.map(c => c.id === id ? { ...c, customName: tempName } : c));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            (c.customName || c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.telegramId.includes(searchQuery)
        );
    }, [customers, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Mijozlar boshqaruvi</h1>
                    <p className="text-gray-400 font-medium">Barcha mijozlar bazasi va shaxsiy qaydlar</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Ism, Tel yoki ID orqali qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-20">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Mijoz (Smart-Roboda)</th>
                                    <th className="px-6 py-4">Asl Ismi / Telegram ID</th>
                                    <th className="px-6 py-4">Kontakt</th>
                                    <th className="px-6 py-4 text-center">Buyurtmalar</th>
                                    <th className="px-6 py-4">Sarflandi</th>
                                    <th className="px-6 py-4 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm font-medium">
                                {filteredCustomers.map((cust) => (
                                    <tr key={cust.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            {editingId === cust.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        autoFocus
                                                        value={tempName}
                                                        onChange={(e) => setTempName(e.target.value)}
                                                        className="px-3 py-1.5 border border-emerald-500 rounded-lg text-sm bg-white outline-none"
                                                    />
                                                    <button onClick={() => handleUpdateName(cust.id)} className="text-emerald-500 hover:scale-110 transition-transform"><Check size={18} /></button>
                                                    <button onClick={() => setEditingId(null)} className="text-red-400 hover:scale-110 transition-transform"><X size={18} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-black uppercase tracking-tight ${cust.customName ? "text-emerald-600" : "text-slate-400 italic"}`}>
                                                        {cust.customName || "Nom berilmagan"}
                                                    </span>
                                                    <button
                                                        onClick={() => { setEditingId(cust.id); setTempName(cust.customName || ""); }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-300 hover:text-emerald-500"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-slate-800 font-bold">{cust.name}</span>
                                                <span className="text-[10px] text-gray-400">ID: {cust.telegramId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Phone size={14} />
                                                <span className="text-xs transition-colors hover:text-emerald-600 cursor-pointer">{cust.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">
                                                {cust.ordersCount} ta
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-800">{cust.totalSpent}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/chat?id=${cust.id}`)}
                                                    className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                >
                                                    <MessageSquare size={18} />
                                                </button>
                                                <button className="p-2 text-gray-300 hover:text-slate-600 hover:bg-gray-100 rounded-xl transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

