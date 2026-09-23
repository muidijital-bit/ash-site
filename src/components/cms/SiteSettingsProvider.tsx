"use client";
import { createContext, useContext, type ReactNode } from "react";
import { defaultBrandSettings, type BrandSettings } from "@/lib/cms/types";

const SettingsContext = createContext<BrandSettings>(defaultBrandSettings);
export function SiteSettingsProvider({ settings, children }: { settings: BrandSettings; children: ReactNode }) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
export const useSiteSettings = () => useContext(SettingsContext);
