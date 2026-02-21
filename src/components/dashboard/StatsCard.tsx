import { LucideIcon, ChevronDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    loading?: boolean;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    iconBgColor,
    iconColor,
    loading = false,
}: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 flex flex-col gap-6 group">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${iconBgColor} ${iconColor} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                        <Icon size={24} />
                    </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 border border-slate-100/50 rounded-xl text-[10px] font-black text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 transition-all uppercase tracking-widest">
                    Har oy <ChevronDown size={10} />
                </button>
            </div>

            <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
                {loading ? (
                    <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mt-2"></div>
                ) : (
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
                )}
            </div>
        </div>
    );
}
