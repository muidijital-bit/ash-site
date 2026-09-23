"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";

type Links = Partial<Record<Locale, string>>;
type Value = { path: string; links: Links } | null;
const Context = createContext<{ value: Value; setValue: (value: Value) => void }>({ value: null, setValue: () => {} });
export function BlogLanguageProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<Value>(null);
  return <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>;
}
export function BlogLanguageLinks({ path, tr, en }: { path: string; tr?: string; en?: string }) {
  const { setValue } = useContext(Context);
  useEffect(() => {
    setValue({ path, links: { tr, en } });
    return () => setValue(null);
  }, [path, tr, en, setValue]);
  return null;
}
export function useBlogLanguageLink(pathname: string, locale: Locale) {
  const { value } = useContext(Context);
  return value?.path === pathname ? value.links[locale] ?? (locale === "tr" ? "/blog" : "/en/blog") : undefined;
}
