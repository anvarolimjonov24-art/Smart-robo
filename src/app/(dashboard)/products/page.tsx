"use client";
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter, Grid, Package, ArrowDownToLine, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/dashboard/products");
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/dashboard/categories");
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || p.category?.name === selectedCategory;
            const matchesStatus = selectedStatus === "all" || (p.isActive ? "Sotuvda" : "Tugagan") === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchQuery, selectedCategory, selectedStatus]);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`"${name}" mahsulotini o'chirishga ishonchingiz komilmi?`)) {
            try {
                const res = await fetch(`/api/dashboard/products/${id}`, { method: "DELETE" });
                if (res.ok) {
                    setProducts((prev) => prev.filter((p) => p.id !== id));
                } else {
                    alert("Xatolik yuz berdi");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleView = (name: string) => {
        alert(`📦 "${name}" mahsulot tafsilotlari sahifasi tez orada qo'shiladi!`);
    };

    const handleEdit = (name: string) => {
        alert(`✏️ "${name}" tahrirlash sahifasi tez orada qo'shiladi!`);
    };

    const handleAddCategory = () => {
        alert("Kategoriya yaratish oynasi tez orada to'liq ishga tushadi. Hozirda Kategoriyalar sahifasidan foydalaning.");
    };

    const handleAddProduct = async () => {
        if (categories.length === 0) {
            alert("Avval kamida 1 ta kategoriya yaratishingiz kerak!");
            return;
        }
        const name = prompt("Yangi mahsulot nomi:");
        if (!name) return;
        const price = prompt("Narxi (raqamda, masalan 1500000):") || "0";
        const catId = categories[0].id; // Tanlash imkoniyati yo'qligi sababli birinchisini olamiz
        const storeId = categories[0].storeId;

        try {
            setLoading(true);
            const res = await fetch("/api/dashboard/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price,
                    categoryId: catId,
                    storeId,
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
                })
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert("Mahsulot qo'shishda xatolik");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mahsulotlar boshqaruvi</h1>
                    <p className="text-gray-400 font-medium">Barcha mahsulotlar va kategoriyalar bilan ishlash</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 px-4 py-2.5 border border-emerald-100 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-all active:scale-95 font-bold text-sm"
                    >
                        <Plus size={18} />
                        <span>Kategoriya qo'shish</span>
                    </button>
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-emerald-100"
                    >
                        <Plus size={18} />
                        <span>Yangi mahsulot</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Qidiruv..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                </div>

                <div className="flex gap-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-100 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">Holati: Barchasi</option>
                        <option value="Sotuvda">Sotuvda</option>
                        <option value="Kam qoldi">Kam qoldi</option>
                        <option value="Tugagan">Tugagan</option>
                    </select>
                </div>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-sm ${selectedCategory === "all"
                        ? "bg-emerald-600 text-white shadow-emerald-100"
                        : "bg-white text-slate-500 border border-gray-100 hover:bg-gray-50"
                        }`}
                >
                    Barchasi
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-sm ${selectedCategory === cat.name
                            ? "bg-emerald-600 text-white shadow-emerald-100"
                            : "bg-white text-slate-500 border border-gray-100 hover:bg-gray-50"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Categories Quick Nav */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                                <Grid size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Kategoriyalar</h3>
                                <p className="text-sm text-gray-400 font-medium tracking-tight">Smartfonlar, Noutbuklar va boshqalar</p>
                            </div>
                        </div>
                        <Link
                            href="/categories"
                            className="px-4 py-2 bg-gray-50 text-slate-600 rounded-xl text-xs font-black hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            Boshqarish
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group premium-card p-4 relative overflow-hidden">
                                    <div className="w-full h-40 bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product.name)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-600 hover:text-emerald-500 shadow-sm active:scale-90 transition-all">
                                                <Edit size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id, product.name)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-600 hover:text-red-500 shadow-sm active:scale-90 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm">{product.name}</h4>
                                    <div className="flex justify-between items-center text-xs font-medium">
                                        <span className="text-emerald-600 font-black">{product.price}</span>
                                        <span className="text-gray-300 uppercase tracking-widest">{product.category?.name || ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-slate-200">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-1 text-emerald-400">Statistika</h3>
                            <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mb-6">Mahsulotlar bo'yicha</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-medium opacity-60">Jami</span>
                                    <span className="text-xl font-black">{products.length} ta</span>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <button onClick={() => alert("Eksport qilinmoqda...")} className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300">
                                        <span>Excel Eksport</span>
                                        <ArrowDownToLine size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
