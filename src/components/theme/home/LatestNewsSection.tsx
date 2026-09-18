/* Tema kaynagindan cikarilmis bolum; yazilar src/content/blog'dan geliyor. */
import Link from "next/link";
import { formatDate } from "@/components/blog/BlogPost";
import { posts } from "@/content/blog";
import "./LatestNewsSection.css";

/*
 * Temanin haber slider'i oldugu gibi korunuyor; yalnizca icerik bizim.
 * Ok tuslarini ve kaydirmayi HomeMotion yonetiyor (sayfadaki diger
 * karuseller gibi): adim genisligi slaytlarin offsetLeft farkindan
 * hesaplandigi icin aradaki 24px bosluk da dogru sayiliyor.
 */
export function LatestNewsSection() {
  return (
    <section className="LatestNews_latest-news__wsZ9D">
      <div className="LatestNews_latest-news__container__rKFfh">
        <div className="LatestNews_latest-news__title__dSoU6 LatestNews_latest-news__title--show__6MwaV">
          <h2 className="Text_text--headline-xl__DqnCT Text_text--weight-bold__jl20H">
            <span className="">Blog</span>
          </h2>
        </div>
        <div className="LatestNews_latest-news__news__1zSLo LatestNews_latest-news__news--show__0XhB1">
          <div className="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden">
            <div className="swiper-wrapper">
              {posts.map((post, i) => (
                <div
                  key={post.slug}
                  className={`swiper-slide${i === 0 ? " swiper-slide-active" : ""}${i === 1 ? " swiper-slide-next" : ""}`}
                >
                  <Link className="LatestNewsItem_latest-news-item__DWzf0" href={`/news/${post.slug}`}>
                    <div className="LatestNewsItem_cover__sytL0 LatestNewsItem_cover--show__gKCIi">
                      <div className="LatestNewsItem_cover__image-container__cYQi2">
                        <span className="capture-12488365a9">
                          {/* Kapak gorseli kod ile cizilmis SVG; stok fotograf kullanilmiyor. */}
                          <img alt="" src={post.cover} decoding="async" sizes="100vw" className="capture-877c27fb16" />
                        </span>
                      </div>
                    </div>
                    <div className="LatestNewsItem_content__gt3y2">
                      <p className="Text_text--headline-s__nsAlr Text_text--weight-bold__jl20H LatestNewsItem_content__category__u0da5">
                        <span className="">{post.category}</span>
                      </p>
                      <p className="Text_text--headline-xl__DqnCT Text_text--weight-bold__jl20H LatestNewsItem_content__title__FQ11T">
                        <span className="">{post.title}</span>
                      </p>
                      <p className="Text_text--body-l__nT4jd Text_text--weight-regular__s9xkg">
                        <span className="">{post.summary}</span>
                      </p>
                      <p className="Text_text--body-m__PgGr_ Text_text--weight-regular__s9xkg LatestNewsItem_content__date__YOsTn">
                        <span className="">{formatDate(post.date)}</span>
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="CarouselNavigation_carousel-navigation__j9lRw">
            <button type="button" id="latest-news-navigation-prev" aria-label="Önceki yazı" className="CarouselNavigation_carousel-navigation__button___D7UI CarouselNavigation_carousel-navigation__button--variant-dark__VzNoK CarouselNavigation_carousel-navigation__button--prev__0SScs CarouselNavigation_carousel-navigation__button--disabled__M_9lh"><svg fill="none" height="56" viewBox="0 0 56 56" width="56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" fill="#fff" r="28" /><path d="m24.4111 38.7696 10.0513-10.0513-10.0513-10.0513" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" /></svg></button>
            <button type="button" id="latest-news-navigation-next" aria-label="Sonraki yazı" className="CarouselNavigation_carousel-navigation__button___D7UI CarouselNavigation_carousel-navigation__button--variant-dark__VzNoK CarouselNavigation_carousel-navigation__button--next__sy2gY"><svg fill="none" height="56" viewBox="0 0 56 56" width="56" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" fill="#fff" r="28" /><path d="m24.4111 38.7696 10.0513-10.0513-10.0513-10.0513" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" /></svg></button>
          </div>
        </div>
      </div>
    </section>
  );
}
