"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    Zap,
    ShieldCheck,
    Check
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

const availableContexts = ["Platform Management", "Shoxparfum", "Sinamed", "Teddy Silicone"];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [activeContext, setActiveContext] = useState("Platform Management");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (pathname === "/admin" || pathname === "/super-admin") {
            setActiveContext("Platform Management");
            localStorage.setItem("activeContext", "Platform Management");
        } else {
            const savedCtx = localStorage.getItem("activeContext");
            if (savedCtx && savedCtx !== "Platform Management") {
                setActiveContext(savedCtx);
            } else {
                setActiveContext("Shoxparfum");
            }
        }
    }, [pathname]);

    const handleSelectContext = (contextName: string) => {
        setActiveContext(contextName);
        localStorage.setItem("activeContext", contextName);
        setShowDropdown(false);

        if (contextName === "Platform Management") {
            router.push("/admin");
        } else {
            router.push("/");
        }
    };

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

            {/* Context Switcher (Platform Management / Store Dropdown) */}
            <div className="px-4 mb-6 relative">
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5 px-1">
                    Context Switcher
                </div>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full flex items-center justify-between bg-slate-50/80 p-3 rounded-2xl border border-slate-100/80 group cursor-pointer hover:bg-slate-100/80 transition-all text-left"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                            <Store size={16} className="text-purple-600" />
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Rejim</span>
                            <span className="text-sm font-bold text-slate-800 leading-none truncate">
                                {pathname === "/admin" || pathname === "/super-admin" ? "Platform Management" : activeContext}
                            </span>
                        </div>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Options */}
                {showDropdown && (
                    <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase px-3 py-1.5">Kontekstni tanlang</p>
                        {availableContexts.map((ctx) => (
                            <button
                                key={ctx}
                                onClick={() => handleSelectContext(ctx)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${(pathname === "/admin" && ctx === "Platform Management") || activeContext === ctx ? "bg-purple-50 text-purple-700 font-black" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                                <span>{ctx}</span>
                                {((pathname === "/admin" && ctx === "Platform Management") || activeContext === ctx) && <Check size={14} strokeWidth={3} />}
                            </button>
                        ))}
                    </div>
                )}
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
                        </div>
                    );
                })}
            </nav>

            {/* SUPER ADMIN Button */}
            <div className="p-4 space-y-3 mt-auto border-t border-slate-50">
                <button
                    onClick={() => handleSelectContext("Platform Management")}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl font-black text-xs transition-all shadow-md ${pathname === "/admin" || pathname === "/super-admin"
                        ? "bg-purple-700 text-white shadow-purple-200 ring-2 ring-purple-400"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60"
                        }`}
                >
                    <div className="p-2 bg-purple-600 text-white rounded-xl shadow-sm">
                        <ShieldCheck size={16} />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="uppercase tracking-wider font-black text-[11px]">SUPER ADMIN</span>
                        <span className="text-[9px] font-medium opacity-80">Platform Management Boshqaruvchi</span>
                    </div>
                </button>

                <div className="text-[10px] text-slate-300 font-bold text-center uppercase tracking-widest pt-1">
                    &copy; 2024 Smart-Robo v2.0 PRO
                </div>
            </div>
        </aside>
    );
}
