"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, Loader2, Phone, User, ChevronLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const initialCustomerId = searchParams.get('id');

    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (initialCustomerId && customers.length > 0) {
            const customer = customers.find(c => c.id === initialCustomerId);
            if (customer) handleSelectCustomer(customer);
        }
    }, [initialCustomerId, customers]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/dashboard/customers");
            const data = await res.json();
            if (Array.isArray(data)) setCustomers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (customerId: string) => {
        setMessagesLoading(true);
        try {
            const res = await fetch(`/api/dashboard/chat/messages?customerId=${customerId}`);
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSelectCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        fetchMessages(customer.id);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedCustomer || sending) return;

        setSending(true);
        const textToSubmit = newMessage;
        setNewMessage("");

        try {
            const res = await fetch("/api/dashboard/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: selectedCustomer.id,
                    text: textToSubmit,
                    storeId: selectedCustomer.storeId || "placeholder"
                })
            });

            if (res.ok) {
                const msg = await res.json();
                setMessages(prev => [...prev, msg]);
            } else {
                alert("Xabar yuborishda xatolik");
                setNewMessage(textToSubmit);
            }
        } catch (error) {
            console.error(error);
            setNewMessage(textToSubmit);
        } finally {
            setSending(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        (c.customName || c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-120px)] flex bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
            {/* Sidebar */}
            <div className={`w-80 border-r border-gray-50 flex flex-col bg-gray-50/30 ${selectedCustomer ? 'hidden md:flex' : 'flex w-full md:w-80'}`}>
                <div className="p-6 border-b border-gray-50 bg-white">
                    <h2 className="text-xl font-black text-slate-800 mb-4">Chat</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                            type="text"
                            placeholder="Mijozni qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                    ) : filteredCustomers.map((cust) => (
                        <div
                            key={cust.id}
                            onClick={() => handleSelectCustomer(cust)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${selectedCustomer?.id === cust.id
                                ? "bg-white border-emerald-100 shadow-lg shadow-emerald-100/20 translate-x-1"
                                : "border-transparent hover:bg-white hover:border-gray-100"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedCustomer?.id === cust.id ? "bg-emerald-500 text-white" : "bg-gray-100 text-slate-400"}`}>
                                {cust.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[11px] font-black truncate uppercase tracking-tight ${selectedCustomer?.id === cust.id ? "text-emerald-600" : "text-slate-800"}`}>
                                        {cust.customName || cust.name}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 truncate font-bold mt-0.5">{cust.phone || "Telefon yo'q"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedCustomer ? 'hidden md:flex' : 'flex'}`}>
                {selectedCustomer ? (
                    <>
                        {/* Header */}
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedCustomer(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                                    {selectedCustomer.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{selectedCustomer.customName || selectedCustomer.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedCustomer.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/20">
                            {messagesLoading ? (
                                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                            ) : messages.length > 0 ? (
                                messages.map((msg, idx) => {
                                    const isAdmin = msg.sender === "ADMIN";
                                    return (
                                        <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                            <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm ${isAdmin
                                                ? "bg-emerald-600 text-white rounded-tr-none"
                                                : "bg-white border border-gray-100 text-slate-700 rounded-tl-none"
                                                }`}>
                                                {msg.text}
                                                <div className={`text-[9px] mt-1 opacity-50 font-black text-right ${isAdmin ? "text-white" : "text-gray-400"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-30 grayscale">
                                    <MessageSquare size={48} className="mb-2" />
                                    <p className="text-xs font-black uppercase tracking-widest">Hozircha xabarlar yo'q</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-gray-50 bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Xabaringizni yozing..."
                                    className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm text-slate-700"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-90 shadow-lg shadow-emerald-100 disabled:opacity-50"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-300">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                            <MessageSquare size={48} />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Suhbatni tanlang</h3>
                        <p className="text-xs font-bold max-w-xs leading-relaxed mt-2 uppercase opacity-50 tracking-tight">
                            Mijozlar bilan jonli muloqot qilish uchun chap tomondagi ro'yxatdan birini tanlang.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
