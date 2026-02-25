"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Grid,
    CreditCard,
    MessageSquare,
    Megaphone,
    Globe,
    Truck,
    MapPin,
    UserCircle,
    Store,
    ChevronDown,
    Plus,
    Zap
} from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: any;
    children?: boolean;
}

const navigation: NavItem[] = [
    { name: "Boshqaruv paneli", href: "/", icon: LayoutDashboard },
    { name: "Buyurtmalar", href: "/orders", icon: ShoppingCart },
    { name: "Mijozlar", href: "/customers", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Mahsulotlar", href: "/products", icon: Package, children: true },
    { name: "Marketing", href: "/marketing", icon: Megaphone, children: true },
    { name: "Platformalar", href: "/platforms", icon: Globe, children: true },
    { name: "To'lov turi", href: "/payments", icon: CreditCard },
    { name: "Yetkazib berish", href: "/delivery", icon: Truck },
    { name: "Filiallar", href: "/branches", icon: MapPin },
    { name: "Xodimlar", href: "/staff", icon: UserCircle, children: true },
    { name: "Tarif rejasi", href: "/subscription", icon: Grid },
    { name: "Robo market", href: "/market", icon: Store },
    { name: "Sozlamalar", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const toggleMenu = (name: string) => {
        setExpandedMenus((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100/50 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">
                        S
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tighter">Smart-Robo</span>
                </div>
            </div>

            <div className="px-4 mb-6">
                <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 group cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center shadow-sm">
                            <Store size={16} className="text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Do'kon</span>
                            <span className="text-sm font-bold text-slate-700 leading-none">Sinamed</span>
                        </div>
                    </div>
                    <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 space-y-1 no-scrollbar">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    const isExpanded = expandedMenus.includes(item.name);

                    return (
                        <div key={item.name}>
                            {item.children ? (
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${active
                                        ? "bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/50"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} strokeWidth={active ? 3 : 2} className={active ? "text-emerald-500" : "text-slate-400"} />
                                        <span>{item.name}</span>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-300 transition-transform duration-300 ${isExpanded ? "rotate-180 text-emerald-400" : ""}`}
                                    />
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${active
                                        ? "bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/50"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} strokeWidth={active ? 3 : 2} className={active ? "text-emerald-500" : "text-slate-400"} />
                                        <span>{item.name}</span>
                                    </div>
                                    {active && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-400"></div>}
                                </Link>
                            )}
                            {item.children && isExpanded && (
                                <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-50">
                                    <Link
                                        href={item.href}
                                        className={`block px-4 py-2 rounded-lg text-xs font-bold transition-colors ${active ? "text-emerald-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                                            }`}
                                    >
                                        Barchasini ko'rish
                                    </Link>
                                    <Link
                                        href={`${item.href}/new`}
                                        className="block px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 transition-colors"
                                    >
                                        + Yangi qo'shish
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <Link
                    href="/subscription"
                    className="group relative w-full bg-slate-900 overflow-hidden text-white p-4 rounded-2xl text-sm font-black flex flex-col gap-2 hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-200"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <span className="flex items-center gap-2">
                            <Zap size={14} className="text-amber-400 fill-amber-400" />
                            PRO PLAN
                        </span>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400"></div>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-medium opacity-60">Status: Aktiv</span>
                        <span className="text-[10px] font-medium opacity-60 italic">Sinov muddati: 7 kun</span>
                    </div>
                    {/* Abstract Background Element */}
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-colors"></div>
                </Link>
            </div>

            <div className="p-4 text-[10px] text-slate-300 font-bold text-center border-t border-slate-50 uppercase tracking-widest">
                &copy; 2024 Smart-Robo v2.0 PRO
            </div>
        </aside>
    );
}
