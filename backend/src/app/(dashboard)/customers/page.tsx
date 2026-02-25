"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Filter, Mail, Phone, MoreVertical, Loader2 } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [customers, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Mijozlar</h1>
                    <p className="text-gray-400 font-medium">Barcha mijozlar bazasi va ularning faolligi</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="relative w-96 flex items-center gap-4 flex-1 max-w-[500px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Mijoz ismi yoki tel raqami..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors font-medium text-sm">
                        <Filter size={18} />
                        <span>Filtr</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-20">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Mijoz</th>
                                <th className="px-6 py-4">Kontakt</th>
                                <th className="px-6 py-4">Buyurtmalar</th>
                                <th className="px-6 py-4">Sarflandi</th>
                                <th className="px-6 py-4">Qo'shilgan sana</th>
                                <th className="px-6 py-4 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredCustomers.map((cust) => (
                                <tr key={cust.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800">{cust.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Phone size={12} />
                                                <span className="text-xs font-medium">{cust.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-bold">{cust.ordersCount} ta</td>
                                    <td className="px-6 py-4 font-black text-emerald-600">{cust.totalSpent}</td>
                                    <td className="px-6 py-4 text-gray-400 font-medium">{cust.joinDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-300 hover:text-slate-600 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

