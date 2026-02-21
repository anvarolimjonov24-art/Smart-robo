"use client";
import { Check, ShieldCheck } from "lucide-react";

const plans = [
    {
        name: "Bepul",
        price: "0 so'm",
        description: "Yangi boshlovchilar uchun",
        features: ["50 tagacha mahsulot", "Telegram Bot", "Cheksiz buyurtmalar", "Asosiy statistika"],
        current: false
    },
    {
        name: "Professional",
        price: "150,000 so'm / oy",
        description: "Kengayayotgan bizneslar uchun",
        features: ["Cheksiz mahsulotlar", "Click/Payme ulanishi", "Mini App (TMA)", "Excel export", "2 ta operator"],
        current: true
    },
    {
        name: "Premium",
        price: "400,000 so'm / oy",
        description: "Yirik brendlar uchun",
        features: ["Barcha Pro imkoniyatlar", "Maxsus branding", "Analitika Plus", "5 ta operator", "Priority support"],
        current: false
    },
];

export default function SubscriptionPage() {
    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Tarif rejalari</h1>
                <p className="text-gray-500 text-lg">Xizmatlarimizdan foydalanish uchun o'zingizga qulay tarifni tanlang. Hozirgi tarifingiz: <span className="text-emerald-600 font-bold">Professional</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`p-8 rounded-3xl border flex flex-col transition-all ${plan.current
                            ? "border-emerald-500 ring-4 ring-emerald-50 bg-white relative shadow-xl shadow-emerald-100/50"
                            : "border-gray-100 bg-white hover:border-gray-200"
                            }`}
                    >
                        {plan.current && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                                Hozirgi tarif
                            </span>
                        )}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                            <p className="text-sm text-gray-400 mt-1 font-medium">{plan.description}</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">{plan.price.split(' ')[0]}</span>
                            <span className="text-gray-400 ml-2 font-bold text-sm uppercase tracking-wider">{plan.price.split(' ').slice(1).join(' ')}</span>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-4 text-sm text-slate-600 font-medium">
                                    <div className="p-1 bg-emerald-50 text-emerald-600 rounded-full mt-0.5">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => {
                                if (!plan.current) {
                                    alert(`🚀 ${plan.name} tarifiga o'tish so'rovi yuborildi!`);
                                }
                            }}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${plan.current
                                ? "bg-emerald-50 text-emerald-300 cursor-not-allowed border border-emerald-100"
                                : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200"
                                }`}>
                            {plan.current ? "Faol" : "Tanlash"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl flex items-center gap-8 max-w-4xl mx-auto border border-gray-100">
                <div className="p-5 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-200">
                    <ShieldCheck size={40} />
                </div>
                <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">Xavfsiz to'lov</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Bizning barcha to'lovlarimiz Click va Payme tizimlari orqali xavfsiz amalga oshiriladi.
                        Mablag'lar 100% kafolatlangan va istalgan vaqtda tarifni bekor qilishingiz mumkin.
                    </p>
                </div>
            </div>
        </div>
    );
}
