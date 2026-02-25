"use client";
import { User, Bell, Plus, ChevronDown, HelpCircle, Zap } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { useState } from "react";

export default function Navbar() {
    const { locale, setLocale, t } = useI18n();
    const [showLang, setShowLang] = useState(false);

    return (
        <header className="h-16 glass border-b border-gray-100/50 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setShowLang(!showLang)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/50 border border-slate-100/50 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <span className="text-lg">{locale === "uz-latin" ? "🇺🇿" : "📜"}</span>
                        <span className="uppercase tracking-widest">{locale === "uz-latin" ? "LATIN" : "КРИЛ"}</span>
                        <ChevronDown size={12} className={`ml-1 text-slate-400 transition-transform ${showLang ? "rotate-180" : ""}`} />
                    </button>

                    {showLang && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowLang(false)}></div>
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { setLocale("uz-latin"); setShowLang(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-left hover:bg-slate-50 transition-colors ${locale === "uz-latin" ? "text-emerald-600 bg-emerald-50/30" : "text-slate-600"}`}
                                >
                                    <span>🇺🇿</span> O'zbek (Latin)
                                </button>
                                <button
                                    onClick={() => { setLocale("uz-cyrillic"); setShowLang(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-left hover:bg-slate-50 transition-colors ${locale === "uz-cyrillic" ? "text-emerald-600 bg-emerald-50/30" : "text-slate-600"}`}
                                >
                                    <span>📜</span> Ўзбек (Кирилл)
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Balance */}
                <div className="hidden md:flex items-center gap-4 bg-emerald-50/50 px-5 py-2 rounded-2xl border border-emerald-100/50 group cursor-pointer hover:bg-emerald-50 transition-all duration-300">
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] text-emerald-600/60 font-black uppercase tracking-[0.2em] leading-none mb-1">Balans</span>
                        <span className="text-sm font-black text-emerald-700 leading-none">1,250,400 UZS</span>
                    </div>
                    <button className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-90 shadow-lg shadow-emerald-200">
                        <Plus size={18} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all active:scale-90">
                        <HelpCircle size={20} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all active:scale-90 relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <div className="flex flex-col text-right hidden lg:flex">
                        <span className="text-xs font-black text-slate-700 leading-none mb-1">Farruxbek</span>
                        <span className="text-[10px] font-bold text-emerald-500 leading-none">Admin</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:border-emerald-300 transition-all">
                        <User size={22} className="group-hover:text-emerald-500 transition-colors" />
                    </div>
                </div>
            </div>
        </header>
    );
}
