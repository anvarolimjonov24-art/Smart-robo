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
    DollarSign,
    Loader2,
    ShieldCheck,
    Store as StoreIcon,
    CreditCard,
    ArrowUpRight,
    Building2,
    Search,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ProductModal from "@/components/dashboard/ProductModal";
import CategoryModal from "@/components/dashboard/CategoryModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage() {
    const [activeContext, setActiveContext] = useState<string>("Shoxparfum");
    const [mounted, setMounted] = useState(false);

    const [showTrial, setShowTrial] = useState(true);
    const [completedSteps, setCompletedSteps] = useState<string[]>(["delivery"]);
    const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0 });
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Super Admin state
    const [searchQuery, setSearchQuery] = useState("");
    const [superStores, setSuperStores] = useState<any[]>([
        { id: "store-1", name: "Shoxparfum", owner: "Shoxrux Xoliqov", phone: "+998 90 123 45 67", status: "ACTIVE", plan: "PRO PLAN", ordersCount: 247, totalRevenue: "18,450,000 so'm" },
        { id: "store-2", name: "Sinamed", owner: "Bahrom aka Margilon", phone: "+998 97 722 71 31", status: "ACTIVE", plan: "PRO PLAN", ordersCount: 142, totalRevenue: "22,179,600 so'm" },
        { id: "store-3", name: "Teddy Silicone", owner: "Alisher Navoiy", phone: "+998 99 885 89 49", status: "TRIAL", plan: "START PLAN", ordersCount: 56, totalRevenue: "5,800,000 so'm" },
        { id: "store-4", name: "Robo Gadgets", owner: "Olim Hakimov", phone: "+998 93 456 78 90", status: "ACTIVE", plan: "PRO PLAN", ordersCount: 89, totalRevenue: "12,300,000 so'm" }
    ]);

    useEffect(() => {
        setMounted(true);

        if (typeof window !== "undefined") {
            const path = window.location.pathname;
            if (path.includes("/admin") || path.includes("/super-admin")) {
                setActiveContext("Platform Management");
                localStorage.setItem("activeContext", "Platform Management");
            } else {
                const savedCtx = localStorage.getItem("activeContext");
                if (savedCtx) setActiveContext(savedCtx);
            }
        }

        const handleContextChange = () => {
            const currentCtx = localStorage.getItem("activeContext");
            if (currentCtx) setActiveContext(currentCtx);
        };
        window.addEventListener("storage", handleContextChange);
        window.addEventListener("contextChange", handleContextChange);

        setLoading(true);
        Promise.all([
            fetch("/api/dashboard/stats").then(res => res.json()).catch(() => ({})),
            fetch("/api/dashboard/categories").then(res => res.json()).catch(() => ([]))
        ]).then(([statsData, categoriesData]) => {
            if (statsData && !statsData.error && statsData.stats) {
                setStats(statsData.stats);
                setChartData(statsData.chartData || []);
            }
            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            }
        }).finally(() => setLoading(false));

        return () => {
            window.removeEventListener("storage", handleContextChange);
            window.removeEventListener("contextChange", handleContextChange);
        };
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/dashboard/categories");
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleStep = (step: string) => {
        setCompletedSteps((prev) =>
            prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
        );
    };

    const handleSwitchToStore = (storeName: string) => {
        localStorage.setItem("activeContext", storeName);
        setActiveContext(storeName);
        window.dispatchEvent(new Event("contextChange"));
    };

    const storeId = categories[0]?.storeId || "placeholder_store_id";

    // IF PLATFORM MANAGEMENT IS ACTIVE -> RENDER SUPER ADMIN DASHBOARD
    if (mounted && activeContext === "Platform Management") {
        const filteredStores = superStores.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.owner.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
                                <StoreIcon size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-800">{superStores.length} ta</p>
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

    // OTHERWISE -> RENDER STORE DASHBOARD VIEW
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Trial Notice */}
            {showTrial && (
                <div className="bg-emerald-50 border border-emerald-100 p-3 px-4 rounded-xl flex items-center justify-between text-emerald-800 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <Info size={18} />
                        </div>
                        <p className="text-sm font-medium">Sizning hisobingizda 7 kunlik bepul sinov ishlayapti ({activeContext} do'koni)</p>
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
                            onClick={(e) => {
                                e.preventDefault();
                                toggleStep("category");
                                setIsCategoryModalOpen(true);
                            }}
                            href="/categories"
                        />
                        <ChecklistItem
                            icon={Package}
                            title="Mahsulot qo'shish"
                            desc="Nomini kiriting, rasmlarni yuklang, tavsif, narx va xususiyatlarni qo'shing."
                            completed={completedSteps.includes("product")}
                            onClick={(e) => {
                                e.preventDefault();
                                toggleStep("product");
                                setIsProductModalOpen(true);
                            }}
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

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSuccess={() => { }}
                categories={categories}
                storeId={storeId}
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSuccess={fetchCategories}
                storeId={storeId}
            />
        </div>
    );
}

function ChecklistItem({ icon: Icon, title, desc, completed = false, onClick, href }: {
    icon: any; title: string; desc: string; completed?: boolean; onClick: (e: any) => void; href: string;
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
