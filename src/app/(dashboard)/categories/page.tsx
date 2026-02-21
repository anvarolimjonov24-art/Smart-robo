"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";

const initialCategories = [
    { id: 1, name: "Smartfonlar", productsCount: 12, status: "Aktiv", order: 1 },
    { id: 2, name: "Noutbuklar", productsCount: 5, status: "Aktiv", order: 2 },
    { id: 3, name: "Aksessuarlar", productsCount: 25, status: "Aktiv", order: 3 },
    { id: 4, name: "Maishiy texnika", productsCount: 0, status: "Paustda", order: 4 },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(initialCategories);

    const handleAddCategory = () => {
        const name = prompt("Yangi kategoriya nomini kiriting:");
        if (name?.trim()) {
            const newCat = {
                id: Date.now(),
                name: name.trim(),
                productsCount: 0,
                status: "Aktiv",
                order: categories.length + 1,
            };
            setCategories((prev) => [...prev, newCat]);
        }
    };

    const handleEdit = (id: number) => {
        const cat = categories.find((c) => c.id === id);
        if (!cat) return;
        const newName = prompt("Kategoriya nomini tahrirlash:", cat.name);
        if (newName?.trim()) {
            setCategories((prev) =>
                prev.map((c) => (c.id === id ? { ...c, name: newName.trim() } : c))
            );
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`"${name}" kategoriyasini o'chirishga ishonchingiz komilmi?`)) {
            setCategories((prev) => prev.filter((c) => c.id !== id));
        }
    };

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
                                                    onClick={() => handleEdit(cat.id)}
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
