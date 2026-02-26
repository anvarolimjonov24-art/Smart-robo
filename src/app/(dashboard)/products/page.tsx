"use client";
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Grid, ArrowDownToLine, Loader2 } from "lucide-react";
import Link from "next/link";
import ProductModal from "@/components/dashboard/ProductModal";
import CategoryModal from "@/components/dashboard/CategoryModal";

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

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
            const matchesCategory = selectedCategory === "all" || p.category === selectedCategory || p.category?.name === selectedCategory;
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

    const handleAddProduct = () => {
        if (categories.length === 0) {
            alert("Avval kamida 1 ta kategoriya yaratishingiz kerak!");
            return;
        }
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleAddCategory = () => {
        setIsCategoryModalOpen(true);
    };

    const storeId = categories[0]?.storeId || "placeholder_store_id";

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
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                                <Grid size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Kategoriyalar</h3>
                                <p className="text-sm text-gray-400 font-medium tracking-tight">Maxsulot turlarini boshqaring</p>
                            </div>
                        </div>
                        <Link
                            href="/categories"
                            className="px-4 py-2 bg-gray-50 text-slate-600 rounded-xl text-xs font-black hover:bg-gray-100 transition-all border border-gray-100"
                        >
                            Boshqarish
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="animate-spin text-emerald-600" size={32} />
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="group bg-white p-4 border border-gray-100 rounded-[2rem] hover:shadow-2xl hover:shadow-emerald-100/50 transition-all relative overflow-hidden">
                                        <div className="w-full h-44 bg-gray-50 rounded-[1.5rem] mb-4 overflow-hidden relative">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditProduct(product)} className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-600 hover:text-emerald-500 shadow-sm active:scale-90 transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id, product.name)} className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-600 hover:text-red-500 shadow-sm active:scale-90 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm px-1">{product.name}</h4>
                                        <div className="flex justify-between items-center text-xs font-bold px-1 mt-2">
                                            <span className="text-emerald-600 font-black">{product.price}</span>
                                            <span className="bg-gray-50 px-3 py-1 rounded-full text-[10px] text-gray-400 uppercase tracking-widest">{typeof product.category === 'string' ? product.category : product.category?.name || ''}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                                    <Plus size={40} />
                                </div>
                                <h3 className="font-black text-slate-400 uppercase tracking-widest">Mahsulot topilmadi</h3>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-1 text-emerald-400 uppercase tracking-tight">Statistika</h3>
                            <p className="text-[10px] opacity-40 uppercase font-black tracking-[0.2em] mb-8">Ma'lumotlar tahlili</p>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold opacity-60">Jami mahsulotlar</span>
                                    <span className="text-3xl font-black">{products.length} ta</span>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button onClick={() => alert("Eksport funksiyasi tez orada...")} className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                        <span>Excel Eksport</span>
                                        <ArrowDownToLine size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSuccess={() => { fetchProducts(); fetchCategories(); }}
                product={editingProduct}
                categories={categories}
                storeId={storeId}
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSuccess={fetchCategories}
                storeId={storeId}
            />
        </div>
    );
}
