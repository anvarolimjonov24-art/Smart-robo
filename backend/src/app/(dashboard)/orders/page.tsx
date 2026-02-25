"use client";
import { useState, useMemo } from "react";
import { Search, Filter, ArrowDownToLine } from "lucide-react";
import OrdersTable from "@/components/dashboard/OrdersTable";

const statuses = ["Barchasi", "Yangi", "Jarayonda", "Tugallangan", "Bekor qilingan"];

export default function OrdersPage() {
    const [activeStatus, setActiveStatus] = useState("Barchasi");
    const [searchQuery, setSearchQuery] = useState("");
    const [exporting, setExporting] = useState(false);

    const handleExport = () => {
        setExporting(true);
        setTimeout(() => {
            setExporting(false);
            alert("✅ Buyurtmalar muvaffaqiyatli Excelga yuklandi!");
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Buyurtmalar</h1>
                    <p className="text-gray-400 font-medium">Barcha kelib tushgan buyurtmalar ro'yxati</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-emerald-100 disabled:opacity-50"
                >
                    <ArrowDownToLine size={18} className={exporting ? "animate-bounce" : ""} />
                    <span>{exporting ? "Yuklanmoqda..." : "Excelga yuklash"}</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="ID yoki mijoz bo'yicha qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors font-medium text-sm">
                        <Filter size={18} />
                        <span>Filtr</span>
                    </button>
                </div>

                <div className="flex gap-1.5">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeStatus === status
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <OrdersTable />
        </div>
    );
}
