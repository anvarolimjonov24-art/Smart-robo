"use client";
import React from 'react';
import { Truck, MapPin, Clock, Plus, ShieldCheck } from 'lucide-react';

export default function DeliveryPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Yetkazib berish</h1>
                    <p className="text-gray-400 font-medium">Kuryerlik xizmati va zonalarni sozlash</p>
                </div>
                <button
                    onClick={() => alert("Kuryer qo'shish...")}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 font-bold text-sm shadow-lg shadow-emerald-100"
                >
                    <Plus size={18} />
                    <span>Kuryer qo'shish</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Truck size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Yetkazib berish shartlari</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-gray-400" />
                                <span className="text-sm font-bold text-slate-600">O'rtacha vaqt</span>
                            </div>
                            <span className="text-sm font-black text-slate-800">30-60 daqiqa</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-gray-400" />
                                <span className="text-sm font-bold text-slate-600">Minimal buyurtma</span>
                            </div>
                            <span className="text-sm font-black text-slate-800">50,000 so'm</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Yetkazib berish zonalari</h3>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-200">
                        Xarita tez orada yuklanadi
                    </div>
                </div>
            </div>
        </div>
    );
}
