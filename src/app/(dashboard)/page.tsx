"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    ShoppingCart,
    Package,
    Users,
    ChevronRight,
    Play,
    Info,
    X,
    MessageSquare,
    Settings,
    Grid,
    Truck,
    DollarSign
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import RevenueChart from "@/components/dashboard/RevenueChart";

export default function DashboardPage() {
    const [showTrial, setShowTrial] = useState(true);
    const [completedSteps, setCompletedSteps] = useState<string[]>(["delivery"]);
    const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0 });
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("/api/dashboard/stats")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setStats(data.stats);
                    setChartData(data.chartData);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleStep = (step: string) => {
        setCompletedSteps((prev) =>
            prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
        );
    };

    return (
        <div className="space-y-6">
            {/* Trial Notice */}
            {showTrial && (
                <div className="bg-emerald-50 border border-emerald-100 p-3 px-4 rounded-xl flex items-center justify-between text-emerald-800 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <Info size={18} />
                        </div>
                        <p className="text-sm font-medium">Sizning hisobingizda 7 kunlik bepul sinov ishlayapti</p>
                    </div>
                    <button
                        onClick={() => setShowTrial(false)}
                        className="text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded-lg hover:bg-emerald-100"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Daromadlar"
                    value={loading ? "---" : `${stats.revenue.toLocaleString()} UZS`}
                    icon={DollarSign}
                    iconBgColor="bg-emerald-50"
                    iconColor="text-emerald-500"
                    loading={loading}
                />
                <StatsCard
                    title="Buyurtmalar"
                    value={loading ? "---" : stats.orders.toString()}
                    icon={ShoppingCart}
                    iconBgColor="bg-amber-50"
                    iconColor="text-amber-500"
                    loading={loading}
                />
                <StatsCard
                    title="Jami mijozlar"
                    value={loading ? "---" : stats.customers.toString()}
                    icon={Users}
                    iconBgColor="bg-indigo-50"
                    iconColor="text-indigo-500"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Checklist Section */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Onlayn biznesingizni hoziroq boshlang!</h2>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                            Onlayn biznesingizni boshlash uchun bir necha qadam qoldi! Sozlamalarni tugatib, birinchi buyurtmalaringizni qabul qiling.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <ChecklistItem
                            icon={MessageSquare}
                            title="Telegram botingizni ulang"
                            desc="BotFather orqali token oling va botingizdan foydalanishni boshlash uchun uni bu yerga kiriting."
                            completed={completedSteps.includes("telegram")}
                            onClick={() => toggleStep("telegram")}
                            href="/settings"
                        />
                        <ChecklistItem
                            icon={Settings}
                            title="Sozlamalar"
                            desc="Kompaniya ma'lumotlarini kiriting, ish vaqtlarini belgilang, valyutani tanlang, logotipni yuklang..."
                            completed={completedSteps.includes("settings")}
                            onClick={() => toggleStep("settings")}
                            href="/settings"
                        />
                        <ChecklistItem
                            icon={Grid}
                            title="Kategoriya qo'shish"
                            desc="Har bir kategoriya uchun rasm yuklang va nom bering."
                            completed={completedSteps.includes("category")}
                            onClick={() => toggleStep("category")}
                            href="/categories"
                        />
                        <ChecklistItem
                            icon={Package}
                            title="Mahsulot qo'shish"
                            desc="Nomini kiriting, rasmlarni yuklang, tavsif, narx va xususiyatlarni qo'shing."
                            completed={completedSteps.includes("product")}
                            onClick={() => toggleStep("product")}
                            href="/products"
                        />
                        <ChecklistItem
                            icon={Truck}
                            title="Yetkazib berish"
                            desc="Olib ketish mavjudligini belgilang va taklif qilayotgan yetkazib berish turlarini tanlang."
                            completed={completedSteps.includes("delivery")}
                            onClick={() => toggleStep("delivery")}
                            href="/delivery"
                        />
                    </div>
                </div>

                {/* Video Guide Section */}
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-video group cursor-pointer block"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1557821552-17105176677c?w=800"
                            alt="Guide video cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity p-8 text-center">
                            <h3 className="text-xl font-bold mb-4">Qanday qilib internet magazin yaratish + telegram botiga ulash</h3>
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-900/40 group-hover:scale-110 transition-transform">
                                <Play size={32} fill="white" stroke="white" />
                            </div>
                            <div className="mt-8 flex gap-8 text-2xl font-black italic tracking-widest uppercase opacity-70">
                                <span>O'rgan</span>
                                <span>O'rnat</span>
                                <span>Soqqa</span>
                            </div>
                        </div>
                    </a>
                    <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
                        <span className="text-sm font-bold">Smart-Robo Video Yo'riqnoma</span>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
                        >
                            YouTube'da ko'rish
                        </a>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[380px]">
                    <RevenueChart
                        title="Daromadlar dinamikasi"
                        data={chartData}
                        dataKey="revenue"
                        color="#10b981"
                        formatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                </div>
                <div className="h-[380px]">
                    <RevenueChart
                        title="Buyurtmalar dinamikasi"
                        data={chartData}
                        dataKey="orders"
                        color="#6366f1"
                        formatter={(val) => val.toString()}
                    />
                </div>
            </div>

            <OrdersTable />
        </div>
    );
}

function ChecklistItem({ icon: Icon, title, desc, completed = false, onClick, href }: {
    icon: any; title: string; desc: string; completed?: boolean; onClick: () => void; href: string;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group block ${completed ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50"
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${completed ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                    }`}>
                    <Icon size={24} />
                </div>
                <div className="max-w-sm">
                    <h4 className={`font-bold text-sm ${completed ? "text-emerald-900" : "text-slate-700"}`}>{title}</h4>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${completed ? "text-emerald-600" : "text-gray-400"}`}>{desc}</p>
                </div>
            </div>
            {completed ? (
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <ChevronRight size={14} strokeWidth={4} />
                </div>
            ) : (
                <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
            )}
        </Link>
    );
}

