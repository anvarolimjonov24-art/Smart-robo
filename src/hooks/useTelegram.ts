"use client";
import { useCallback, useEffect, useMemo } from "react";
import type { TelegramWebApp, WebAppUser, ThemeParams, HapticFeedback } from "@/types/telegram";

function getTelegram(): TelegramWebApp | null {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        return window.Telegram.WebApp;
    }
    return null;
}

export function useTelegram() {
    const webApp = useMemo(() => getTelegram(), []);
    const user: WebAppUser | undefined = webApp?.initDataUnsafe?.user;
    const initData: string = webApp?.initData || "";
    const themeParams: ThemeParams = webApp?.themeParams || {};
    const colorScheme = webApp?.colorScheme || "light";
    const platform = webApp?.platform || "unknown";

    // Initialize on mount
    useEffect(() => {
        if (webApp) {
            webApp.ready();
            webApp.expand();
        }
    }, [webApp]);

    // Back Button helpers
    const showBackButton = useCallback((callback: () => void) => {
        if (webApp?.BackButton) {
            webApp.BackButton.show();
            webApp.BackButton.onClick(callback);
        }
    }, [webApp]);

    const hideBackButton = useCallback(() => {
        if (webApp?.BackButton) {
            webApp.BackButton.hide();
        }
    }, [webApp]);

    // Main Button helpers
    const showMainButton = useCallback((text: string, callback: () => void, color?: string) => {
        if (webApp?.MainButton) {
            webApp.MainButton.setParams({
                text,
                is_visible: true,
                is_active: true,
                color: color || webApp.themeParams.button_color || "#10b981",
            });
            webApp.MainButton.onClick(callback);
        }
    }, [webApp]);

    const hideMainButton = useCallback(() => {
        if (webApp?.MainButton) {
            webApp.MainButton.hide();
        }
    }, [webApp]);

    const setMainButtonLoading = useCallback((loading: boolean) => {
        if (webApp?.MainButton) {
            if (loading) {
                webApp.MainButton.showProgress(true);
            } else {
                webApp.MainButton.hideProgress();
            }
        }
    }, [webApp]);

    // Haptic Feedback helpers
    const haptic: HapticFeedback | null = webApp?.HapticFeedback || null;

    const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
        haptic?.impactOccurred(style);
    }, [haptic]);

    const hapticNotification = useCallback((type: 'error' | 'success' | 'warning') => {
        haptic?.notificationOccurred(type);
    }, [haptic]);

    const hapticSelection = useCallback(() => {
        haptic?.selectionChanged();
    }, [haptic]);

    // Data helpers
    const sendData = useCallback((data: any) => {
        if (webApp) {
            webApp.sendData(typeof data === "string" ? data : JSON.stringify(data));
        }
    }, [webApp]);

    const close = useCallback(() => {
        webApp?.close();
    }, [webApp]);

    // Popup helpers
    const showPopup = useCallback((params: { title?: string; message: string; buttons?: any[] }, callback?: (buttonId: string) => void) => {
        if (webApp) {
            webApp.showPopup(params, callback);
        } else {
            alert(params.message);
        }
    }, [webApp]);

    const showAlert = useCallback((message: string, callback?: () => void) => {
        if (webApp) {
            webApp.showAlert(message, callback);
        } else {
            alert(message);
            callback?.();
        }
    }, [webApp]);

    const showConfirm = useCallback((message: string, callback?: (confirmed: boolean) => void) => {
        if (webApp) {
            webApp.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback?.(result);
        }
    }, [webApp]);

    // Link helpers
    const openLink = useCallback((url: string) => {
        if (webApp) {
            webApp.openLink(url);
        } else {
            window.open(url, "_blank");
        }
    }, [webApp]);

    const openTelegramLink = useCallback((url: string) => {
        if (webApp) {
            webApp.openTelegramLink(url);
        } else {
            window.open(url, "_blank");
        }
    }, [webApp]);

    // Theme helpers
    const setHeaderColor = useCallback((color: string) => {
        webApp?.setHeaderColor(color);
    }, [webApp]);

    const setBackgroundColor = useCallback((color: string) => {
        webApp?.setBackgroundColor(color);
    }, [webApp]);

    return {
        webApp,
        user,
        initData,
        themeParams,
        colorScheme,
        platform,
        isReady: !!webApp,

        // Back Button
        showBackButton,
        hideBackButton,

        // Main Button
        showMainButton,
        hideMainButton,
        setMainButtonLoading,

        // Haptic
        hapticImpact,
        hapticNotification,
        hapticSelection,

        // Data
        sendData,
        close,

        // Popups
        showPopup,
        showAlert,
        showConfirm,

        // Links
        openLink,
        openTelegramLink,

        // Theme
        setHeaderColor,
        setBackgroundColor,
    };
}
