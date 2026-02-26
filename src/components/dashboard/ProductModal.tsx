"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Check, Package, DollarSign, Image as ImageIcon, AlignLeft, Grid } from "lucide-react";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: any; // If editing
    categories: any[];
    storeId: string;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product, categories, storeId }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.rawPrice?.toString() || product.price.toString().replace(/[^0-9]/g, ""),
                categoryId: product.categoryId,
                description: product.description || "",
                image: product.image || ""
            });
        } else {
            setFormData({
                name: "",
                price: "",
                categoryId: categories[0]?.id || "",
                description: "",
                image: ""
            });
        }
    }, [product, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = product
            ? `/api/dashboard/products/${product.id}`
            : "/api/dashboard/products";
        const method = product ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, storeId })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                const data = await res.json();
                alert(data.error || "Xatolik yuz berdi");
            }
        } catch (error) {
            console.error(error);
            alert("Server bilan aloqa uzildi");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">
                                {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
                            </h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Do'koningizga mahsulot qo'shing</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-100 active:scale-90">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <Package size={12} className="text-emerald-500" /> Mahsulot nomi
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Masalan: iPhone 15 Pro Max"
                                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <DollarSign size={12} className="text-emerald-500" /> Narxi (So'mda)
                            </label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Masalan: 12000000"
                                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <Grid size={12} className="text-emerald-500" /> Kategoriya
                            </label>
                            <select
                                name="categoryId"
                                required
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all appearance-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                <ImageIcon size={12} className="text-emerald-500" /> Rasm URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://rasm-manzili..."
                                className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                            <AlignLeft size={12} className="text-emerald-500" /> Tavsif
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mahsulot haqida batafsil ma'lumot..."
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold text-slate-700 transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-3xl font-black text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`flex-[2] py-4 rounded-3xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xl ${success
                                    ? "bg-emerald-500 text-white shadow-emerald-200"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 disabled:opacity-50"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : success ? (
                                <><Check size={20} strokeWidth={4} /> Saqlandi!</>
                            ) : (
                                "Mahsulotni saqlash"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
