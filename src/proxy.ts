import { NextResponse, type NextRequest } from "next/server";
import { internalPath, localePath, splitLocale } from "@/i18n/config";
import { SITE_URL } from "@/content/site";
import { refreshAdminSession } from "@/lib/supabase/proxy";

/**
 * Adres yonlendirmesi.
 *
 * Gelen adres once mantiksal yola cevrilir, sonra o dilin dogru adresiyle
 * karsilastirilir:
 * - dogru adresse (/urunler/sapai-x, /en/products/sapai-x) adres cubugu
 *   degismeden ic rotaya (/tr/products/sapai-x) yeniden yazilir;
 * - eski ya da baska dilde yazilmis adres (/products, /our-dna, /tr/...,
 *   /en/news/<turkce-slug>) dogru adrese kalici yonlendirilir.
 * Bilinmeyen adresler ic rotada dilin kendi 404 sayfasina duser.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return refreshAdminSession(request);
  if (pathname.startsWith("/api/")) return NextResponse.next();
  const { locale, path } = splitLocale(pathname);
  const canonical = localePath(locale, path);
  const url = request.nextUrl.clone();
  const siteHost = new URL(SITE_URL).hostname;
  const responseForHost = (response: NextResponse) => {
    // Preview and vercel.app aliases must not compete with the canonical domain.
    if (request.nextUrl.hostname !== siteHost) response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  };

  if (siteHost.startsWith("www.") && request.nextUrl.hostname === siteHost.slice(4)) {
    return NextResponse.redirect(new URL(`${canonical}${url.search}`, SITE_URL), 308);
  }

  // Paylasim gorselleri (og:image) sayfa degil dosyadir: adresleri metadata
  // tarafindan ic rotaya gore uretildigi icin yonlendirilmeden sunulur.
  if (pathname.endsWith("/opengraph-image")) {
    const internal = internalPath(locale, path);
    return responseForHost(internal === pathname ? NextResponse.next() : NextResponse.rewrite(new URL(internal, request.nextUrl)));
  }

  if (canonical !== pathname) {
    url.pathname = canonical;
    return responseForHost(NextResponse.redirect(url, 308));
  }

  url.pathname = internalPath(locale, path);
  // Dil bilgisi, 404 sayfasinin (global-not-found.tsx) okuyabilmesi icin
  // istek basligina yazilir; o dosya params alamaz.
  const headers = new Headers(request.headers);
  headers.set("x-ash-locale", locale);
  return responseForHost(url.pathname === pathname
    ? NextResponse.next({ request: { headers } })
    : NextResponse.rewrite(url, { request: { headers } }));
}

export const config = {
  // Next'in kendi dosyalari ve uzantili istekler (gorsel, css, sitemap.xml, robots.txt) haric.
  matcher: ["/((?!_next/|.*\\.[^/]+$).*)"],
};
