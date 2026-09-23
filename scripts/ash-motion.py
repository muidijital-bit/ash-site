"""
Anasayfa animasyonunu gri zemine bindirir ve kutularin cevresindeki beyaz haleyi siler.

Girdi: ayni animasyonun beyaz (W) ve siyah (B) zeminli iki ciktisi.
  B = alfa * renk            (siyah uzerinde, on-carpimli renk)
  W - B = (1 - alfa) * 255   (iki zemin arasindaki fark)
Gri zemin (bg) uzerindeki sonuc, bolme yapmadan:
  cikti = bg - s * (alfa * bg - B)
s = 1 iken bu, dogrudan bindirmenin aynisidir. Yari saydam ve beyaz pikseller
(kutularin cevresindeki hale) icin s -> 0: o pikseller zemine erir.
Renkli paritilar (mavi/pembe/lila) ve opak kutu govdeleri etkilenmez.

Kutularin dis kenarinda bir de TAM OPAK beyaz parilti seridi var; saydamligi
~1 oldugu icin formul onu kutu yuzunden ayiramaz. Uzamsal olarak ayrilir: kutu
yuzu renkli bir kenarla (bevel) cevrili, serit ise bos zemine degiyor. Zeminden
baslayip yalniz beyaz pikseller uzerinden en fazla 14 px ilerleyerek ulasilan
pikseller silinir. Kurdelenin parlak yansimalari etkilenmesin diye bu adim
yalniz sabit bolgede (kutular, ASH dairesi) uygulanir.
"""
import subprocess
import sys

import numpy as np

W_SRC, B_SRC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
WIDTH, HEIGHT = 1440, 824
# Notr gri: tarayicilar YUV->RGB matrisini farkli varsayabilir; notr grinin
# sonucu matristen bagimsizdir, her tarayicida ayni ton cikar. Serit de #f6f6f6.
BG = np.array([246.0, 246.0, 246.0])
FPS_OUT = 30                           # 150 kare / 30 fps = 5 sn (%20 hizli)


def reader(path):
    return subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE,
    )


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def box_blur(img, r=1):
    # s haritasindaki tek piksellik gurultuyu yumusatir (3x3 ortalama).
    p = np.pad(img, r, mode="edge")
    acc = np.zeros_like(img)
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            acc += p[r + dy: r + dy + img.shape[0], r + dx: r + dx + img.shape[1]]
    return acc / (2 * r + 1) ** 2


def dilate(m):
    p = np.pad(m, 1)
    return (p[:-2, :-2] | p[:-2, 1:-1] | p[:-2, 2:] | p[1:-1, :-2] | p[1:-1, 1:-1]
            | p[1:-1, 2:] | p[2:, :-2] | p[2:, 1:-1] | p[2:, 2:])


def static_mask(path):
    # Beyaz kaynakta zamanla degismeyen pikseller; kurdeleye 4 px'ten yakin yerler haric.
    r = reader(path)
    frames = []
    while True:
        buf = r.stdout.read(WIDTH * HEIGHT * 3)
        if len(buf) < WIDTH * HEIGHT * 3:
            break
        frames.append(np.frombuffer(buf, np.uint8).reshape(HEIGHT, WIDTH, 3).mean(axis=2))
    moving = np.stack(frames).std(axis=0) >= 1.5
    for _ in range(4):
        moving = dilate(moving)
    return ~moving


STATIC = static_mask(W_SRC)
wr, br = reader(W_SRC), reader(B_SRC)
enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y",
     "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS_OUT), "-i", "-",
     "-an", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "14",
     "-profile:v", "high", "-movflags", "+faststart",
     # Renk etiketi eklenmiyor: kaynaklar etiketsiz, onayli surumle ayni renk yolu korunur.
     OUT],
    stdin=subprocess.PIPE,
)

size = WIDTH * HEIGHT * 3
n = 0
while True:
    wb, bb = wr.stdout.read(size), br.stdout.read(size)
    if len(wb) < size or len(bb) < size:
        break
    W = np.frombuffer(wb, np.uint8).reshape(HEIGHT, WIDTH, 3).astype(np.float32)
    B = np.frombuffer(bb, np.uint8).reshape(HEIGHT, WIDTH, 3).astype(np.float32)

    a3 = np.clip(1 - (W - B) / 255, 0, 1)          # kanal basina alfa
    alpha = a3.mean(axis=2)
    # Beyazlik testi: piksel beyaz zeminli videoda da beyazsa (W her kanalda ~255)
    # rengi beyazdir. Rengi alfaya bolerek bulmak yari saydam bolgede gurultulu
    # oluyor ve beyaz halenin bir kismini "renkli" sayip birakiyordu.
    # Renkli parilti beyaz zeminde en az bir kanalda belirgin koyulasir, ayrisir.
    beyazlik = smoothstep(246, 253, W.min(axis=2))
    korunan = smoothstep(0.90, 0.985, alpha)        # opak kutu govdesi korunur
    s = 1 - beyazlik * (1 - korunan)

    # Dis beyaz serit: zeminden beyaz pikseller uzerinden ulasilan bant.
    seed = alpha < 0.3
    passable = (W.min(axis=2) >= 250) & (B.min(axis=2) >= 190) & STATIC
    reach = seed.copy()
    for _ in range(14):
        reach |= dilate(reach) & passable
    s[reach & ~seed] = 0

    s = box_blur(s)[..., None]

    out = BG - s * (a3 * BG - B)
    enc.stdin.write(np.clip(np.rint(out), 0, 255).astype(np.uint8).tobytes())
    n += 1

enc.stdin.close()
enc.wait()
print(f"{n} kare islendi -> {OUT} ({n / FPS_OUT:.1f} sn)")
