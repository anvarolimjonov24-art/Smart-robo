"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import uzLatin from "@/i18n/uz-latin.json";
import uzCyrillic from "@/i18n/uz-cyrillic.json";

type Locale = "uz-latin" | "uz-cyrillic";

interface I18nContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

const translations: Record<Locale, any> = {
    "uz-latin": uzLatin,
    "uz-cyrillic": uzCyrillic,
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocale] = useState<Locale>("uz-latin");

    useEffect(() => {
        const savedLocale = localStorage.getItem("locale") as Locale;
        if (savedLocale && (savedLocale === "uz-latin" || savedLocale === "uz-cyrillic")) {
            setLocale(savedLocale);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem("locale", newLocale);
    };

    const t = (key: string) => {
        const keys = key.split(".");
        let value = translations[locale];
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Fallback to key itself
            }
        }
        return typeof value === "string" ? value : key;
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
};
