"use client";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const initialOrders = [
    { id: "cm7890abc", orderNumber: 1234, customer: "Ali Valiyev", product: "iPhone 15 Pro", amount: "15,000,000 so'm", status: "NEW", date: "2024-03-20" },
    { id: "cm7890def", orderNumber: 1235, customer: "Olim Hakimov", product: "MacBook Air M2", amount: "12,500,000 so'm", status: "PROCESSING", date: "2024-03-19" },
    { id: "cm7890ghi", orderNumber: 1236, customer: "Zilola Ergasheva", product: "AirPods Pro 2", amount: "2,800,000 so'm", status: "DELIVERED", date: "2024-03-19" },
];

const statusMap: Record<string, { label: string, style: string }> = {
    "NEW": { label: "Yangi", style: "bg-blue-50 text-blue-600" },
    "PROCESSING": { label: "Tayyorlanmoqda", style: "bg-orange-50 text-orange-600" },
    "SHIPPING": { label: "Yo'lda", style: "bg-purple-50 text-purple-600" },
    "DELIVERED": { label: "Yetkazildi", style: "bg-emerald-50 text-emerald-600" },
    "CANCELLED": { label: "Bekor qilindi", style: "bg-red-50 text-red-600" },
};

export default function OrdersTable() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/dashboard/orders");
            const data = await response.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const response = await fetch("/api/orders/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (!response.ok) throw new Error("Status update failed");

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert("Xatolik yuz berdi");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
                <p className="text-sm font-bold opacity-40">Buyurtmalar yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-800">So'nggi buyurtmalar</h3>
                <button className="text-emerald-600 text-xs font-black uppercase tracking-wider hover:text-emerald-700 transition-colors">Barcha buyurtmalar</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-black tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Mijoz</th>
                            <th className="px-6 py-4">Mahsulot</th>
                            <th className="px-6 py-4">Summa</th>
                            <th className="px-6 py-4">Holat</th>
                            <th className="px-6 py-4">Sana</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-700">#{order.orderNumber}</td>
                                <td className="px-6 py-4 font-medium text-gray-600">{order.customer}</td>
                                <td className="px-6 py-4 text-gray-500 font-medium">{order.product}</td>
                                <td className="px-6 py-4 font-black text-slate-800">{order.amount}</td>
                                <td className="px-6 py-4">
                                    <div className="relative inline-block">
                                        <select
                                            value={order.status}
                                            disabled={updatingId === order.id}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`appearance-none px-3 py-1.5 rounded-xl text-[11px] font-black outline-none border-none cursor-pointer pr-8 ${statusMap[order.status].style}`}
                                        >
                                            {Object.entries(statusMap).map(([key, val]) => (
                                                <option key={key} value={key}>{val.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {updatingId === order.id ? (
                                                <Loader2 size={12} className="animate-spin text-gray-400" />
                                            ) : (
                                                <CheckCircle2 size={12} className="opacity-40" />
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
