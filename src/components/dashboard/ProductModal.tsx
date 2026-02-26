"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: any;
    categories: any[];
    storeId: string;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product, categories, storeId }: ProductModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.rawPrice?.toString() || product.price.toString().replace(/[^\d.]/g, ""),
                categoryId: typeof product.category === 'string' ? product.category : (product.category?.id || ""),
                description: product.description || "",
                image: product.image || "",
            });
        } else {
            setFormData({
                name: "",
                price: "",
                categoryId: categories[0]?.id || "",
                description: "",
                image: "",
            });
        }
    }, [product, categories, isOpen]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });
            const result = await res.json();
            if (result.url) {
                setFormData(prev => ({ ...prev, image: result.url }));
            } else {
                alert("Rasm yuklashda xatolik yuz berdi");
            }
        } catch (error) {
            console.error(error);
            alert("Server bilan aloqa uzildi");
        } finally {
            setUploading(false);
        }
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                {success && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-emerald-600 animate-in fade-in duration-300">
                        <CheckCircle2 size={64} className="mb-4 animate-bounce" />
                        <h3 className="text-xl font-black uppercase tracking-widest">Muvaffaqiyatli!</h3>
                    </div>
                )}

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
                            </h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Do'koningizni to'ldiring</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mahsulot nomi</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                placeholder="Masalan: Smart Watch V8"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Narxi (UZS)</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                                    placeholder="500,000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Kategoriya</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Rasm (URL yoki Yuklash)</label>
                            <div className="flex gap-2">
                                <input
                                    required
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-xs text-slate-700"
                                    placeholder="https://images.com/image.jpg"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 bg-gray-100 text-slate-600 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            {formData.image && (
                                <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Tavsif (Ixtiyoriy)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 min-h-[100px] resize-none"
                                placeholder="Mahsulot haqida batafsil ma'lumot..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (product ? "Saqlash" : "Qo'shish")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
