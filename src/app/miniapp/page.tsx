"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, ChevronRight, Plus, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";

export default function MiniAppPage() {
    const [categories, setCategories] = useState<string[]>(["Barchasi"]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Barchasi");
    const [searchQuery, setSearchQuery] = useState("");
    const { addToCart, getItemCount } = useCart();
    const { hapticImpact, hapticNotification } = useTelegram();
    const [addedIds, setAddedIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAllProducts(data);
                    // Extract unique categories from products if they contain category objects
                    const cats = Array.from(new Set(data.map((p: any) => p.category?.name))).filter(Boolean);
                    // Prepend "Barchasi" to the categories list
                    setCategories(["Barchasi", ...cats]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return allProducts.filter((p) => {
            const matchesCategory = activeCategory === "Barchasi" || p.category?.name === activeCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, allProducts]);

    const handleAddToCart = (product: any) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            priceNum: product.priceNum,
            image: product.image,
        });
        hapticNotification("success");
        setAddedIds((prev) => [...prev, product.id]);
        setTimeout(() => {
            setAddedIds((prev) => prev.filter((id) => id !== product.id));
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold opacity-60">Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen animate-in fade-in duration-500 pb-32 bg-white">
            {/* AKSU Header */}
            <header className="p-4 flex flex-col items-center text-center relative">
                <h1 className="text-sm font-black uppercase tracking-widest text-[#1a1a1a]">AKSU</h1>
                <p className="text-[10px] text-gray-400 font-medium lowercase">мини-приложение</p>
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-blue-500 text-lg font-bold">...</span>
                </button>
            </header>

            {/* Address Prompt */}
            <div className="px-4 py-2 text-center space-y-2">
                <p className="text-[11px] font-bold text-gray-400">Заказать по этому адресу?</p>
                <h2 className="text-sm font-black text-[#1a1a1a]">микрорайон Алмазар, 6/7</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <button className="px-6 py-2 rounded-xl bg-gray-100 text-[12px] font-bold text-gray-500 active:scale-95 transition-all">Нет</button>
                    <button className="px-8 py-2 rounded-xl bg-[#4b611e] text-[12px] font-bold text-white active:scale-95 transition-all shadow-sm">Да</button>
                </div>
            </div>

            {/* AKSU Style Category Icons/Pills */}
            <div className="overflow-x-auto no-scrollbar flex gap-4 px-4 py-6 mt-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(cat);
                            hapticImpact("light");
                        }}
                        className="flex flex-col items-center gap-2 min-w-[60px]"
                    >
                        <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${activeCategory === cat ? "bg-[#4b611e] text-white" : "bg-gray-50 text-gray-400 border border-gray-100"
                                }`}
                        >
                            {/* Simple category icons */}
                            {cat === "Smartfonlar" && <Plus size={20} className="rotate-45" />}
                            {cat === "Barchasi" && <div className="w-4 h-4 rounded-full border-2 border-current" />}
                            {!["Smartfonlar", "Barchasi"].includes(cat) && <div className="w-1.5 h-6 bg-current opacity-20 transform -rotate-45" />}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${activeCategory === cat ? "text-[#4b611e]" : "text-gray-400"
                            }`}>
                            {cat}
                        </span>
                    </button>
                ))}
            </div>

            {/* AKSU Style Products Grid */}
            <div className="px-4 space-y-10 mt-4">
                {categories.filter(c => c !== "Barchasi").map((cat) => {
                    const productsInCat = filteredProducts.filter(p => p.category?.name === cat);
                    if (productsInCat.length === 0) return null;

                    return (
                        <div key={cat} className="space-y-6">
                            <h3 className="text-lg font-black text-[#1a1a1a] px-1 uppercase tracking-tight">
                                {cat}
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                                {productsInCat.map((p) => {
                                    const justAdded = addedIds.includes(p.id);
                                    return (
                                        <div key={p.id} className="space-y-3 flex flex-col items-start group">
                                            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100/50 shadow-sm transition-transform active:scale-95">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="space-y-1 px-1 w-full">
                                                <p className="text-[12px] font-black text-[#4b611e]">
                                                    {p.price} UZS
                                                </p>
                                                <h4 className="text-[11px] font-bold text-[#1a1a1a] line-clamp-2 leading-tight">
                                                    {p.name}
                                                </h4>
                                                <button
                                                    onClick={() => handleAddToCart(p)}
                                                    className="w-full h-10 mt-3 rounded-2xl bg-gray-50 flex items-center justify-center transition-all active:scale-90 active:bg-gray-100 border border-gray-100/50 shadow-sm"
                                                >
                                                    <Plus size={16} className={justAdded ? "text-green-500" : "text-gray-400"} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && !loading && (
                <div className="py-20 text-center space-y-3">
                    <p className="text-sm font-bold opacity-30 uppercase tracking-widest">Ничего не найдено</p>
                </div>
            )}
        </div>
    );
}
