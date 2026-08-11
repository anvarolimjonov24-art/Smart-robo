"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, Store, Users, CreditCard, ArrowUpRight, CheckCircle2, Search, Building2, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [stores, setStores] = useState<any[]>([
        { id: "store-1", name: "Shoxparfum", owner: "Shoxrux Xoliqov", phone: "+998 90 123 45 67", status: "ACTIVE", plan: "PRO PLAN", ordersCount: 247, totalRevenue: "18,450,000 so'm" },
        { id: "store-2", name: "Sinamed", owner: "Bahrom aka Margilon", phone: "+998 97 722 71 31", status: "ACTIVE", plan: "PRO PLAN", ordersCount: 142, totalRevenue: "22,179,600 so'm" },
        { id: "store-3", name: "Teddy Silicone", owner: "Alisher Navoiy", phone: "+998 99 885 89 49", status: "TRIAL", plan: "START PLAN", ordersCount: 56, totalRevenue: "5,800,000 so'm" },
        { id: "store-4", name: "Robo Gadgets", owner: "Olim Hakimov", phone: "+998 93 456 78 90", status: "ACTIVE", plan: "PRO PLAN", ordersCount: 89, totalRevenue: "12,300,000 so'm" }
    ]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("activeContext", "Platform Management");
            window.dispatchEvent(new Event("contextChange"));
        }
        setLoading(false);
    }, []);

    const filteredStores = stores.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSwitchToStore = (storeName: string) => {
        localStorage.setItem("activeContext", storeName);
        window.dispatchEvent(new Event("contextChange"));
        alert(`✅ "${storeName}" do'koniga o'tildi...`);
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <RefreshCw className="animate-spin text-purple-600 mb-2" size={32} />
                <p className="text-xs font-bold text-gray-500">Super Admin Platform Management yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="flex flex-wrap justify-between items-center bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck size={16} /> Platform Management / Super Admin
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Super Admin Platform Boshqaruv Paneli</h1>
                    <p className="text-purple-200 text-sm font-medium">Barcha do'konlar, mijozlar va tizim sozlamalarini yagona joydan boshqaring</p>
                </div>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Jami Do'konlar</span>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <Store size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-800">{stores.length} ta</p>
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <ArrowUpRight size={14} /> Barcha faol do'konlar
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Jami Mijozlar</span>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-800">1,480 ta</p>
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <ArrowUpRight size={14} /> Global foydalanuvchilar
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Jami Tizim Tushumi</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-800">58,729,600 so'm</p>
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <ArrowUpRight size={14} /> Barcha aylanma
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Aktiv Obunalar</span>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                            <Building2 size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-800">3 PRO / 1 Trial</p>
                    <p className="text-xs text-gray-400 font-medium">98% barqaror</p>
                </div>
            </div>

            {/* Store Management & Context Switcher Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Platform Management — Do'konlar Boshqaruvi</h2>
                        <p className="text-xs text-gray-400 font-medium">Istalgan do'kon profiliga o'ting yoki sozlamalarni o'zgartiring</p>
                    </div>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Do'kon qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Do'kon Nomi</th>
                                <th className="px-6 py-4">Egasining Ismi</th>
                                <th className="px-6 py-4">Telefon</th>
                                <th className="px-6 py-4">Tarif Plan</th>
                                <th className="px-6 py-4">Buyurtmalar</th>
                                <th className="px-6 py-4">Tushum</th>
                                <th className="px-6 py-4">Holat</th>
                                <th className="px-6 py-4 text-center">Do'konga O'tish</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredStores.map((st) => (
                                <tr key={st.id} className="hover:bg-purple-50/30 transition-colors">
                                    <td className="px-6 py-4 font-black text-slate-800 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                            {st.name.charAt(0)}
                                        </div>
                                        {st.name}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-600">{st.owner}</td>
                                    <td className="px-6 py-4 font-medium text-gray-500">{st.phone}</td>
                                    <td className="px-6 py-4 font-bold text-purple-600">{st.plan}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{st.ordersCount} ta</td>
                                    <td className="px-6 py-4 font-black text-slate-800">{st.totalRevenue}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 size={12} /> {st.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleSwitchToStore(st.name)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors shadow-md shadow-purple-100"
                                        >
                                            🔄 Shu do'konga o'tish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
