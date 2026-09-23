#!/usr/bin/env python3
"""
Iletisim sayfasindaki ofis haritasini uretir.

Neden statik gorsel:
  - OpenStreetMap'in gomulu cercevesi (export/embed.html) artik WebGL
    istiyor; desteklemeyen tarayicida haritanin yerine hata metni cikiyor.
  - Google Maps gomulusu calisir ama ucuncu taraf cerezi birakir, bu da
    cerez politikasina ek gerektirir.
  - Doseme goruntuleri bir kez indirilip tek bir gorsele dikilince sayfada
    hic ucuncu taraf istegi kalmiyor: cerez yok, WebGL yok, anahtar yok.

Kullanim:
    venv/bin/python scripts/ash-harita.py

Ciktiyi public/images/ altina yazar. Adres degisirse MERKEZ'i guncelleyin
(koordinat Nominatim'den alinir) ve betigi tekrar calistirin; dosya adindaki
surum numarasini da artirin, /images/* 30 gun onbellekleniyor.
"""

from __future__ import annotations

import io
import math
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw

# Zorlu Center, 2 Koru Sokagi, Levazim Mah., Besiktas (Nominatim kaydi).
MERKEZ = (41.06649, 29.01804)
ZOOM = 18                       # 2x cikti icin; ekranda 17'ye denk gelir
GENISLIK, YUKSEKLIK = 2880, 1080  # 16:6 serit, 1440px kapsayici icin 2x
CIKTI = Path("public/images/ash-harita-zorlu.webp")          # masaustu 2x (16:6)
CIKTI_1X = Path("public/images/ash-harita-zorlu-1440.webp")  # masaustu 1x
CIKTI_DAR = Path("public/images/ash-harita-zorlu-dar.webp")  # mobil 2x (4:3)

DOSEME = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
AJAN = "ash-site static map builder (one-off, hello@aisolutionhouse.com)"
# Atif gorsele gomulmez: sayfada HTML olarak, dile gore ve openstreetmap.org/
# copyright baglantisiyla basilir (MapSection.tsx).


def konum_piksel(lat: float, lon: float, z: int) -> tuple[float, float]:
    """Web Mercator: enlem/boylam -> dunya piksel koordinati."""
    n = 256 * 2**z
    x = (lon + 180.0) / 360.0 * n
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y


def doseme_indir(z: int, x: int, y: int) -> Image.Image:
    istek = urllib.request.Request(DOSEME.format(z=z, x=x, y=y), headers={"User-Agent": AJAN})
    with urllib.request.urlopen(istek, timeout=30) as yanit:
        return Image.open(io.BytesIO(yanit.read())).convert("RGB")


def harita_ciz() -> Image.Image:
    mx, my = konum_piksel(*MERKEZ, ZOOM)
    sol, ust = mx - GENISLIK / 2, my - YUKSEKLIK / 2
    ilk_x, ilk_y = int(sol // 256), int(ust // 256)
    son_x, son_y = int((sol + GENISLIK) // 256), int((ust + YUKSEKLIK) // 256)

    tuval = Image.new("RGB", (GENISLIK, YUKSEKLIK), "#eef0f7")
    toplam = (son_x - ilk_x + 1) * (son_y - ilk_y + 1)
    sayac = 0
    for tx in range(ilk_x, son_x + 1):
        for ty in range(ilk_y, son_y + 1):
            sayac += 1
            print(f"  doseme {sayac}/{toplam}", end="\r", flush=True)
            tuval.paste(doseme_indir(ZOOM, tx, ty), (int(tx * 256 - sol), int(ty * 256 - ust)))
            time.sleep(0.12)  # doseme sunucusuna karsi nazik olalim
    print()
    return tuval


def isaret_koy(im: Image.Image) -> None:
    """Merkeze marka renginde bir nokta, cevresine beyaz halka ve golge."""
    cx, cy = GENISLIK // 2, YUKSEKLIK // 2
    katman = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ciz = ImageDraw.Draw(katman)
    for yaricap, renk in ((46, (5, 10, 43, 28)), (34, (255, 255, 255, 255)), (24, (116, 72, 232, 255))):
        ciz.ellipse((cx - yaricap, cy - yaricap, cx + yaricap, cy + yaricap), fill=renk)
    im.paste(katman, (0, 0), katman)


def varyant_yaz(im: Image.Image) -> None:
    """Kucuk ekranlar tam boy gorseli indirmesin diye iki turev uretilir.

    Mobilde serit 4:3'e doner ve CSS kenarlari kirpar; o kirpimi burada
    yapinca indirilen veri ucte birine iniyor.
    """
    bir_x = im.resize((GENISLIK // 2, YUKSEKLIK // 2), Image.LANCZOS)
    bir_x.save(CIKTI_1X, "WEBP", quality=86, method=6)

    dar_en = int(YUKSEKLIK * 4 / 3)
    sol = (GENISLIK - dar_en) // 2
    dar = im.crop((sol, 0, sol + dar_en, YUKSEKLIK)).resize((1080, 810), Image.LANCZOS)
    dar.save(CIKTI_DAR, "WEBP", quality=86, method=6)


def main() -> None:
    print(f"Harita uretiliyor: z{ZOOM}, {GENISLIK}x{YUKSEKLIK}")
    im = harita_ciz()
    isaret_koy(im)
    CIKTI.parent.mkdir(parents=True, exist_ok=True)
    im.save(CIKTI, "WEBP", quality=88, method=6)
    varyant_yaz(im)
    for yol in (CIKTI, CIKTI_1X, CIKTI_DAR):
        print(f"yazildi: {yol}  ({yol.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
