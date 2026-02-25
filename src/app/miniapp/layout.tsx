"use client";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CartProvider } from "@/context/CartContext";
import { useTelegram } from "@/hooks/useTelegram";
import { Home, ShoppingCart, Package, User } from "lucide-react";

function MiniAppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { webApp, hapticImpact, showBackButton, hideBackButton } = useTelegram();

    // Apply full theme params as CSS variables
    useEffect(() => {
        if (webApp) {
            const tp = webApp.themeParams;
            const root = document.documentElement;
            if (tp.bg_color) root.style.setProperty('--tg-theme-bg-color', tp.bg_color);
            if (tp.text_color) root.style.setProperty('--tg-theme-text-color', tp.text_color);
            if (tp.hint_color) root.style.setProperty('--tg-theme-hint-color', tp.hint_color);
            if (tp.link_color) root.style.setProperty('--tg-theme-link-color', tp.link_color);
            if (tp.button_color) root.style.setProperty('--tg-theme-button-color', tp.button_color);
            if (tp.button_text_color) root.style.setProperty('--tg-theme-button-text-color', tp.button_text_color);
            if (tp.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', tp.secondary_bg_color);
            if (tp.header_bg_color) root.style.setProperty('--tg-theme-header-bg-color', tp.header_bg_color);
            if (tp.bottom_bar_bg_color) root.style.setProperty('--tg-theme-bottom-bar-bg-color', tp.bottom_bar_bg_color);
            if (tp.accent_text_color) root.style.setProperty('--tg-theme-accent-text-color', tp.accent_text_color);
            if (tp.section_bg_color) root.style.setProperty('--tg-theme-section-bg-color', tp.section_bg_color);
            if (tp.destructive_text_color) root.style.setProperty('--tg-theme-destructive-text-color', tp.destructive_text_color);

            // Safe area insets
            const sa = webApp.safeAreaInset;
            if (sa) {
                root.style.setProperty('--tg-safe-area-inset-top', `${sa.top}px`);
                root.style.setProperty('--tg-safe-area-inset-bottom', `${sa.bottom}px`);
            }
            const csa = webApp.contentSafeAreaInset;
            if (csa) {
                root.style.setProperty('--tg-content-safe-area-inset-top', `${csa.top}px`);
            }
        }
    }, [webApp]);

    // Back button for sub-pages
    useEffect(() => {
        const isSubPage = pathname !== "/miniapp";
        if (isSubPage) {
            showBackButton(() => {
                window.history.back();
            });
        } else {
            hideBackButton();
        }
        return () => hideBackButton();
    }, [pathname, showBackButton, hideBackButton]);

    const tabs = [
        { href: "/miniapp", icon: Home, label: "Bosh sahifa" },
        { href: "/miniapp/cart", icon: ShoppingCart, label: "Savatcha" },
        { href: "/miniapp/orders", icon: Package, label: "Buyurtmalar" },
        { href: "/miniapp/profile", icon: User, label: "Profil" },
    ];

    return (
        <div
            className="min-h-screen antialiased"
            style={{
                backgroundColor: "var(--tg-theme-bg-color, #ffffff)",
                color: "var(--tg-theme-text-color, #000000)",
                paddingTop: "var(--tg-safe-area-inset-top, 0px)",
            }}
        >
            <main className="pb-20">
                {children}
            </main>

            <nav
                className="fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-4 z-50"
                style={{
                    backgroundColor: "var(--tg-theme-bottom-bar-bg-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
                    borderColor: "var(--tg-theme-section-separator-color, #e5e5e5)",
                    paddingBottom: "var(--tg-safe-area-inset-bottom, 0px)",
                }}
            >
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            onClick={() => hapticImpact("light")}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "opacity-100" : "opacity-50"
                                }`}
                            style={{
                                color: isActive
                                    ? "var(--tg-theme-accent-text-color, var(--tg-theme-button-color, #10b981))"
                                    : "var(--tg-theme-hint-color, #9ca3af)",
                            }}
                        >
                            <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold">{tab.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

export default function MiniAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
            <MiniAppShell>{children}</MiniAppShell>
        </CartProvider>
    );
}
