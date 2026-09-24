import { Inter } from "next/font/google";

/**
 * Sitenin yazi tipi: her cihazda ayni gorunsun diye sistem fontu yerine
 * Inter (Mac'in San Francisco'suna en yakin acik font). Dosyalar derleme
 * sirasinda indirilip siteyle ayni adresten sunulur; ziyaretcinin
 * tarayicisi Google'a istek atmaz.
 */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  // Optik boyut: buyuk basliklarda harfler sikilasir, Mac'in San Francisco
  // Display'i gibi. Olmadan basliklar daha genis kalip fazladan satira iniyordu.
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});
