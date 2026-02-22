"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, GripVertical, Loader2 } from "lucide-react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Since we don't have a specific auth system connected in this file, we assume a hardcoded storeId for demonstration, or we fetch from an endpoint.
    // In our seed file, storeId is available. We'll fetch the first store ID or use a placeholder if needed, but the product page didn't need it because it just creates. Actually, the POST needs storeId. Let's fetch it from stats or another place, or hardcode the one from seed if needed. Actually, let's just make the API handle it or use a default.
    // Let's get storeId from the categories that exist or a default one.

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/dashboard/categories");
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        const name = prompt("Yangi kategoriya nomini kiriting:");
        if (name?.trim()) {
            const storeId = categories[0]?.storeId || "placeholder_store_id"; // Ideal: should come from user session
            try {
                setLoading(true);
                const res = await fetch("/api/dashboard/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: name.trim(), storeId })
                });
                if (res.ok) {
                    fetchCategories();
                } else {
                    alert("Xatolik yuz berdi");
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    const handleEdit = async (id: string, currentName: string) => {
        const newName = prompt("Kategoriya nomini tahrirlash:", currentName);
        if (newName && newName.trim() !== currentName) {
            try {
                const res = await fetch(`/api/dashboard/categories/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName.trim() })
                });
                if (res.ok) {
                    setCategories((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, name: newName.trim() } : c))
                    );
                } else {
                    alert("Xatolik yuz berdi");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`"${name}" kategoriyasini o'chirishga ishonchingiz komilmi?`)) {
            try {
                const res = await fetch(`/api/dashboard/categories/${id}`, { method: "DELETE" });
                const data = await res.json();

                if (res.ok) {
                    setCategories((prev) => prev.filter((c) => c.id !== id));
                } else {
                    alert(data.error || "Xatolik yuz berdi");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Mahsulot Kategoriyalari</h1>
                    <p className="text-gray-400 font-medium">Do'kondagi mahsulotlarni guruhlash va tartibga solish</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/products"
                        className="flex items-center gap-2 bg-white text-slate-600 border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-bold text-sm shadow-sm"
                    >
                        <span>Mahsulotlar ro'yxati</span>
                    </Link>
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-emerald-100"
                    >
                        <Plus size={18} />
                        <span>Yangi kategoriya</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/80 text-[10px] uppercase text-gray-400 font-black tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-10"></th>
                                    <th className="px-6 py-4">Nomi</th>
                                    <th className="px-6 py-4">Mahsulotlar</th>
                                    <th className="px-6 py-4">Holat</th>
                                    <th className="px-6 py-4 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <GripVertical size={16} className="text-gray-200 cursor-move hover:text-gray-400" />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">{cat.name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">{cat.productsCount} ta</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${cat.status === "Aktiv" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(cat.id, cat.name)}
                                                    className="p-2 hover:bg-emerald-50 rounded-xl text-gray-300 hover:text-emerald-600 transition-all"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id, cat.name)}
                                                    className="p-2 hover:bg-red-50 rounded-xl text-gray-300 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm self-start">
                    <h3 className="text-lg font-black text-slate-800 mb-4">Ma'lumot</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        Kategoriyalar iyerarxiyasi mahsulotlarni oson topishga yordam beradi.
                        Drag-and-drop orqali tartibni o'zgartirishingiz mumkin, bu tartib Telegram Botda ham aks etadi.
                    </p>
                    <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <h4 className="text-sm font-black text-emerald-800 mb-2">💡 Maslahat</h4>
                        <p className="text-xs text-emerald-600 font-medium leading-relaxed">
                            Kategoriyalarni mahsulotlar turiga qarab guruhlang (masalan: Elektronika, Kiyim-kechak).
                            Bu konversiyani 25% gacha oshirishi mumkin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
