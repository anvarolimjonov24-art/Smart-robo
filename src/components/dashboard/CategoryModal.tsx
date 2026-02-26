"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Check } from "lucide-react";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category?: any; // If editing
    storeId: string;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, category, storeId }: CategoryModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName("");
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = category
            ? `/api/dashboard/categories/${category.id}`
            : "/api/dashboard/categories";
        const method = category ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, storeId })
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">
                            {category ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">Kategoriya ma'lumotlarini kiriting</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Kategoriya nomi</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masalan: Smartfonlar"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl ${success
                                ? "bg-emerald-500 text-white shadow-emerald-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 disabled:opacity-50"
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : success ? (
                            <><Check size={20} strokeWidth={4} /> Saqlandi!</>
                        ) : (
                            "Saqlash"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
