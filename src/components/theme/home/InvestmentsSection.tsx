import Link from "next/link";
import tr from "./InvestmentsSection.content.json";
import en from "./InvestmentsSection.content.en.json";
import { localePath, type Locale } from "@/i18n/config";
import assets from "./InvestmentsSection.assets.json";
import { ProductName } from "@/components/theme/shared/ProductName";
import "./InvestmentsSection.css";

export function InvestmentsSection({ locale }: { locale: Locale }) {
  const content = locale === "en" ? en : tr;
  const products = [
    { slug: "hubai-x", name: content.text_004, description: content.text_005, cta: content.text_006, image: assets.image_001 },
    { slug: "sapai-x", name: content.text_007, description: content.text_008, cta: content.text_009, image: assets.image_002 },
    { slug: "masraf-x", name: content.text_010, description: content.text_011, cta: content.text_012, image: assets.image_003 },
    { slug: "crm-x", name: content.text_013, description: content.text_014, cta: content.text_015, image: assets.image_004 },
  ];

  return (
    <section className="Investments_investments__txwNj" aria-labelledby="home-products-title">
      <div className="Investments_title__V9mJV Investments_title--show__dV8hJ">
        <h2 id="home-products-title" className="Text_text--headline-l__23dDN Text_text--weight-bold__jl20H Investments_title__title__D87hC">
          {content.text_001}
        </h2>
        <p className="Text_text--display-m__q0ZjI Text_text--weight-bold__jl20H Investments_title__subtitle__HagA_">
          {content.text_002}{" "}<span className="ash-grad-text">{content.text_002_accent}</span>
        </p>
        <p className="Text_text--headline-m--extra-height__cgsfA Text_text--weight-medium__uNX0v Investments_title__description__olHdP">
          {content.text_003}
        </p>
      </div>

      <div className="Investments_cards__cdnel Investments_cards--show__UBLb8">
        <div className="ash-product-grid">
          {products.map((product) => (
            <article key={product.slug} className="Investments_card__akzVq" aria-labelledby={`home-${product.slug}`}>
              <div className="Card_card__pfJM5">
                <div className="Card_card__image__8P0LP Card_card__image--show__enVi0">
                  <div>
                    <span className="capture-04520533a0">
                      <span className="capture-d3e536b2a1" />
                      <img alt="" src={product.image} loading="lazy" decoding="async" className="capture-77bda95619" />
                    </span>
                  </div>
                </div>
                <div className="Card_card__title__XTrbs">
                  <h3 id={`home-${product.slug}`} className="Text_text--headline-xl__DqnCT Text_text--weight-medium__uNX0v">
                    <ProductName name={product.name} />
                  </h3>
                </div>
                <div className="Card_card__body__eJKeS">
                  <p className="Text_text--body-m__PgGr_ Text_text--weight-regular__s9xkg">{product.description}</p>
                </div>
                <div className="Card_card__link__gVEN4">
                  <Link href={localePath(locale, `/products/${product.slug}`)} aria-label={`${product.name} — ${product.cta}`} className="Button_button__30ukX Button_button--variant-colorful-dark__CCVPh Button_button--radius-large__M_ook">
                    <span className="Button_button__children__eLy5L">{product.cta}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
