import Link from "next/link";
/* Browser-extracted source design; editable copy/assets live beside this component. */
import content from "./WhatWeDoSection.content.json";
import assets from "./WhatWeDoSection.assets.json";
import "./WhatWeDoSection.css";

export function WhatWeDoSection() {
  return (<>
    <section className="WhatWeDo_what-we-do__sYjRm"><div className="WhatWeDo_what-we-do__container__HAnJ7"><div className="WhatWeDo_content__QLu2p WhatWeDo_content--show__jNsWI"><h2 className="Text_text--headline-l__23dDN Text_text--weight-bold__jl20H WhatWeDo_what-we-do__title__MOf9N"><span className="">{content.text_001}</span></h2><p className="Text_text--display-s__xN_wr Text_text--weight-bold__jl20H WhatWeDo_what-we-do__subtitle__NQD8i"><span className="">{content.text_002}</span></p><p className="Text_text--headline-m__C9G6u Text_text--weight-medium__uNX0v"><span className="">{content.text_003}</span></p></div></div><div className="WhatWeDo_visual__r7Ena"><div className="WhatWeDo_visual__wrapper__OF6c1 WhatWeDo_visual__wrapper--show__Vp7Tt"><span className="capture-04520533a0"><span className="capture-63572ea22d"></span><img alt="" sizes="100vw" src={assets.image_001} decoding="async" className="capture-77bda95619" /></span></div></div><div className="WhatWeDo_content__QLu2p WhatWeDo_content--show__jNsWI"><p className="Text_text--headline-m__C9G6u Text_text--weight-medium__uNX0v WhatWeDo_what-we-do__description__MwTei"><span className="">{content.text_004}</span></p><Link href="/products" className="Button_button__30ukX Button_button--variant-filled-light__vqIaI Button_button--radius-large__M_ook WhatWeDo_what-we-do__button__kpZUo"><div className="Button_button__children__eLy5L">{content.text_005}</div><div className="Button_button__spinner__HYDVQ"><span></span><span></span><span></span></div></Link></div></section>
  </>);
}
