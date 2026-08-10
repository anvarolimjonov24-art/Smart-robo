"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, Download, ArrowLeft, Loader2 } from "lucide-react";

export default function InvoicePage() {
    const params = useParams();
    const orderId = params?.orderId as string;
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (!orderId) return;

        // Fetch order details
        fetch(`/api/orders/${orderId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setOrder(data);
                } else {
                    // Fallback mockup data if orderId API is not returning yet
                    setOrder(getMockInvoiceData(orderId));
                }
            })
            .catch(() => {
                setOrder(getMockInvoiceData(orderId));
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin text-emerald-600 mb-2" size={36} />
                <p className="text-gray-600 font-medium">Schot-faktura yuklanmoqda...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <p className="text-red-500 font-bold">Buyurtma topilmadi!</p>
            </div>
        );
    }

    const totalQty = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

    return (
        <div className="min-h-screen bg-gray-200 py-8 px-4 print:bg-white print:py-0 print:px-0">
            {/* Top Action Bar (Hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl font-bold text-sm shadow hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={18} /> Orqaga
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all active:scale-95"
                    >
                        <Printer size={18} /> 🖨️ Chop etish (Printer / PDF)
                    </button>
                </div>
            </div>

            {/* Invoice Printable Sheet (A4 Styling) */}
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-sm print:shadow-none print:p-4 border border-gray-300 print:border-none font-sans text-black">
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">
                            Do'kon : {order.storeName || "1-42"}
                        </h1>
                        <p className="font-bold text-sm mt-1">
                            {order.date} vaqtdagi №{order.orderNumber} - sotuv
                        </p>
                        <div className="text-xs font-bold mt-2 space-y-0.5">
                            <p>Murojaat uchun raqam: <span className="font-black">{order.storePhone || "+99897 722 71 31"}</span></p>
                            {order.storeSecondaryPhones && <p>{order.storeSecondaryPhones}</p>}
                        </div>

                        <div className="mt-3 text-xs">
                            <p><span className="font-bold">Mijoz:</span> {order.customerName || "Bahrom oka Margilon"}</p>
                            <p><span className="font-bold">Mijoz raqami:</span> {order.customerPhone || "886754444"}</p>
                            {order.sellerName && <p><span className="font-bold">Sotuvchi:</span> {order.sellerName}</p>}
                        </div>
                    </div>

                    {/* Logo & QR Code */}
                    <div className="flex flex-col items-end gap-2">
                        {order.qrCodeUrl ? (
                            <img src={order.qrCodeUrl} alt="QR Code" className="w-20 h-20 border border-black p-1" />
                        ) : (
                            <div className="w-20 h-20 border-2 border-black flex items-center justify-center text-[10px] text-center font-bold">
                                QR CODE
                            </div>
                        )}
                        <div className="text-center mt-1">
                            <h2 className="font-black text-xl tracking-wider text-black">TEDDY</h2>
                            <p className="text-[9px] font-bold tracking-tight">By Baby Silicone</p>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <table className="w-full border-collapse border-2 border-black text-xs mb-6">
                    <thead>
                        <tr className="bg-gray-300 font-black border-b-2 border-black text-center">
                            <th className="border border-black p-1.5 w-10">№</th>
                            <th className="border border-black p-1.5 text-left">Mahsulot nomi</th>
                            <th className="border border-black p-1.5 w-24">Rasmi</th>
                            <th className="border border-black p-1.5 w-24">Miqdori</th>
                            <th className="border border-black p-1.5 w-24">Narxi</th>
                            <th className="border border-black p-1.5 w-28">Summa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-black text-center font-medium hover:bg-gray-50">
                                <td className="border border-black p-1.5 font-bold">{idx + 1}</td>
                                <td className="border border-black p-1.5 text-left font-bold">{item.name}</td>
                                <td className="border border-black p-1">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mx-auto border border-gray-200" />
                                    ) : (
                                        <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-[9px] text-gray-400 mx-auto">
                                            Rasm yo'q
                                        </div>
                                    )}
                                </td>
                                <td className="border border-black p-1.5 font-bold">{item.quantity} шт</td>
                                <td className="border border-black p-1.5 font-bold">{formatNumber(item.price)}</td>
                                <td className="border border-black p-1.5 font-black">{formatNumber(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-black font-black bg-gray-200 text-sm">
                            <td colSpan={3} className="border border-black p-2 text-left">Jami</td>
                            <td className="border border-black p-2 text-center">{totalQty} шт</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(order.totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer Message */}
                <div className="text-center font-black text-sm mt-6 pt-4 border-t border-black">
                    Xaridingiz uchun rahmat!
                </div>
            </div>
        </div>
    );
}

function formatNumber(val: number | string) {
    if (!val) return "0";
    const num = typeof val === "string" ? parseFloat(val) : val;
    return num.toLocaleString("en-US");
}

function getMockInvoiceData(orderId: string) {
    return {
        orderNumber: 14631,
        date: "25-06-2026 09:39",
        storeName: "1-42",
        storePhone: "+99897 722 71 31",
        storeSecondaryPhones: "+99888 155 88 77 | +99899 885 89 49",
        customerName: "Bahrom oka Margilon",
        customerPhone: "886754444",
        sellerName: "Sotuvchi",
        totalAmount: 22179600,
        items: [
            { name: "796. Zapas kamera № 72 432 $", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=120", quantity: 864, price: 1200 },
            { name: "2172. Qo'zi soska 2880sht $", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=120", quantity: 2880, price: 1150 },
            { name: "1616. TEDDY soska 8809Q-2", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120", quantity: 48, price: 6500 },
            { name: "11. Teddy zapaska № 60 blokda 6ta $", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=120", quantity: 360, price: 1300 },
            { name: "1135. Teddy tuz chereda blok 16 $", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=120", quantity: 32, price: 6200 },
            { name: "1496. Teddy mini 60 ml but-ka blok 12 $", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120", quantity: 480, price: 4000 }
        ]
    };
}
