/* Native images are intentional here: the logo is an exact owner-provided PWA asset. */
/* eslint-disable @next/next/no-img-element */
import { LiveRouteButton, SiteClient } from "./site-client";
import { siteConfig } from "./site-config";

const {
  directionsUrl,
  mapEmbedUrl,
  mapPlaceUrl,
  phoneDisplay,
  phoneInternational,
  routeDestination,
  whatsappBase,
} = siteConfig;
const routeQuery = encodeURIComponent(routeDestination);
const wazeUrl = `https://waze.com/ul?q=${routeQuery}&navigate=yes`;
const neshanUrl = `https://neshan.org/maps?search=${routeQuery}`;
const baladUrl = `https://balad.ir/search?term=${routeQuery}`;

const services = [
  {
    index: "۰۱",
    title: "جراحی دهان و ایمپلنت",
    description:
      "بررسی شرایط فک و دهان و انتخاب مسیر درمان پس از معاینه و تصویربرداری موردنیاز.",
  },
  {
    index: "۰۲",
    title: "ترمیم و زیبایی لبخند",
    description:
      "ارزیابی محافظه‌کارانه برای ترمیم، کامپوزیت، اصلاح فرم و هماهنگی طبیعی لبخند.",
  },
  {
    index: "۰۳",
    title: "درمان ریشه و حفظ دندان",
    description:
      "تشخیص علت درد و برنامه درمانی متناسب با وضعیت واقعی دندان و بافت‌های اطراف.",
  },
  {
    index: "۰۴",
    title: "پروتز و روکش",
    description:
      "طراحی درمان برای بازسازی عملکرد و ظاهر دندان با توجه به شرایط هر بیمار.",
  },
  {
    index: "۰۵",
    title: "دندانپزشکی کودکان",
    description:
      "مراجعه آرام، قابل‌فهم و مرحله‌ای برای بررسی، پیشگیری و درمان کودکان.",
  },
  {
    index: "۰۶",
    title: "مشاوره و طرح درمان",
    description:
      "جمع‌بندی گزینه‌ها، اولویت‌ها و مراحل درمان پیش از تصمیم و شروع کار.",
  },
];

const steps = [
  ["گفت‌وگوی اولیه", "نیاز و زمان مناسب مراجعه را مشخص می‌کنیم."],
  ["معاینه و ارزیابی", "وضعیت واقعی دهان و دندان بررسی می‌شود."],
  ["طرح درمان شفاف", "مراحل پیشنهادی و اولویت‌ها توضیح داده می‌شود."],
  ["درمان و پیگیری", "روند درمان و مراقبت بعدی منظم دنبال می‌شود."],
];

const stepNumbers = ["۰۱", "۰۲", "۰۳", "۰۴"];

const discoveryPoints = [
  {
    title: "موقعیت مطب روی نقشه",
    text: "موقعیت مطب را روی نقشه ببینید و پیش از حرکت برای مراجعه هماهنگ کنید.",
  },
  {
    title: "انتخاب مسیر درمان",
    text: "خدمات به زبان ساده دسته‌بندی شده‌اند؛ تشخیص نهایی فقط پس از معاینه انجام می‌شود.",
  },
  {
    title: "هماهنگی پیش از مراجعه",
    text: "برای درخواست نوبت تماس بگیرید یا در واتساپ پیام بفرستید؛ زمان مراجعه باید با مطب هماهنگ شود.",
  },
];

const faqs = [
  {
    question: "دندانپزشکی دکتر مینا مازندرانی در کدام منطقه تهران است؟",
    answer:
      "مطب در منطقه ۲۲ تهران است. موقعیت آن را در بخش «موقعیت» روی نقشه ببینید و پیش از حرکت با مطب هماهنگ کنید.",
  },
  {
    question: "چگونه برای مراجعه هماهنگ کنم؟",
    answer:
      "برای درخواست نوبت تماس بگیرید یا در واتساپ پیام بفرستید. ارسال پیام به‌معنای تأیید نوبت نیست؛ زمان مراجعه را با مطب هماهنگ کنید.",
  },
  {
    question: "آیا سایت روی آیفون و اندروید نصب می‌شود؟",
    answer:
      "در مرورگرهای سازگار می‌توانید میان‌بر سایت را به صفحهٔ اصلی گوشی اضافه کنید. برای دیدن مراحل، «نصب برنامه مینا» را بزنید. گزینه‌های نصب به دستگاه و مرورگر شما بستگی دارند.",
  },
  {
    question: "آیا اطلاعات سایت جایگزین معاینه پزشکی است؟",
    answer:
      "خیر. توضیحات سایت برای آشنایی و هدایت مراجعه است و تشخیص یا انتخاب درمان فقط پس از ارزیابی پزشک انجام می‌شود.",
  },
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",
        "@id": `${siteConfig.origin}/#clinic`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        url: siteConfig.origin,
        logo: `${siteConfig.origin}/mina-logo.jpeg`,
        image: `${siteConfig.origin}/mina-logo.jpeg`,
        description:
          "وب‌سایت رسمی دندانپزشکی دکتر مینا مازندرانی در منطقه ۲۲ تهران برای تماس، آشنایی با خدمات و مسیریابی.",
        telephone: phoneInternational,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phoneInternational,
          contactType: "appointments",
          availableLanguage: ["fa"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "تهران",
          addressRegion: "منطقه ۲۲",
          addressCountry: "IR",
        },
        areaServed: { "@type": "AdministrativeArea", name: "تهران، منطقه ۲۲" },
        hasMap: mapPlaceUrl,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.origin}/#website`,
        url: siteConfig.origin,
        name: siteConfig.name,
        inLanguage: "fa-IR",
        publisher: { "@id": `${siteConfig.origin}/#clinic` },
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        رفتن به محتوای اصلی
      </a>

      <header className="site-header" aria-label="سربرگ سایت">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="صفحه اصلی دکتر مینا مازندرانی">
            <span className="brand-mark">
              <img
                src="/mina-logo.jpeg"
                alt="لوگوی دندانپزشکی دکتر مینا مازندرانی"
                width={52}
                height={52}
              />
            </span>
            <span className="brand-copy">
              <strong>دکتر مینا مازندرانی</strong>
              <small>دندانپزشکی در منطقه ۲۲ تهران</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="ناوبری اصلی">
            <a href="#services">خدمات</a>
            <a href="#local-dentistry">منطقه ۲۲</a>
            <a href="#journey">روند مراجعه</a>
            <a href="#location">موقعیت</a>
            <a href="#faq">سؤالات</a>
          </nav>

          <a className="header-call" data-conversion="phone_call" data-conversion-label="header" href={`tel:${phoneInternational}`}>
            <span>تماس مستقیم</span>
            <bdi>{phoneDisplay}</bdi>
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="home">
          <div className="hero-orb hero-orb-one" aria-hidden="true" />
          <div className="hero-orb hero-orb-two" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                دندانپزشکی تخصصی صدف · منطقه ۲۲ تهران
              </div>
              <h1>
                یک مسیر روشن برای
                <span> مراقبت از لبخند شما</span>
              </h1>
              <p>
                برای هماهنگی نوبت با مطب تماس بگیرید، با خدمات آشنا شوید
                و مسیر مراجعه را روی نقشه ببینید.
              </p>

              <div className="hero-actions" aria-label="راه‌های اقدام سریع">
                <a
                  className="button button-primary"
                  data-whatsapp-link
                  data-conversion="appointment_whatsapp"
                  data-conversion-label="hero"
                  href={`${whatsappBase}?text=${encodeURIComponent("سلام، برای دریافت نوبت و مشاوره پیام می‌دهم.")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  درخواست نوبت در واتساپ
                  <span aria-hidden="true">←</span>
                </a>
                <a className="button button-secondary" data-conversion="directions" data-conversion-label="hero" href={directionsUrl} target="_blank" rel="noreferrer">
                  مسیریابی از موقعیت من
                </a>
              </div>

              <div className="trust-strip" aria-label="ویژگی‌های اصلی">
                <div>
                  <span className="trust-icon" aria-hidden="true">✓</span>
                  <span><strong>ارتباط مستقیم</strong><small>تماس و واتساپ مستقیم</small></span>
                </div>
                <div>
                  <span className="trust-icon" aria-hidden="true">⌖</span>
                  <span><strong>موقعیت مطب</strong><small>نمایش روی نقشه</small></span>
                </div>
                <div>
                  <span className="trust-icon" aria-hidden="true">↻</span>
                  <span><strong>دسترسی آسان</strong><small>راهنمای افزودن به گوشی</small></span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-label="هویت تصویری مینا">
              <div className="logo-stage">
                <span className="logo-ring logo-ring-one" aria-hidden="true" />
                <span className="logo-ring logo-ring-two" aria-hidden="true" />
                <div className="logo-card">
                  <img
                    src="/mina-logo.jpeg"
                    alt="لوگوی رسمی دندان دکتر مینا مازندرانی"
                    width={1024}
                    height={1024}
                    fetchPriority="high"
                  />
                </div>
                <div className="floating-note note-top">
                  <span className="status-pulse" aria-hidden="true" />
                  آماده راهنمایی شما
                </div>
                <div className="floating-note note-bottom">
                  <strong>مینا</strong>
                  <span>راهنمای سریع سایت</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">خدمات</span>
                <h2>از مسئله شما تا مسیر درمان مناسب</h2>
              </div>
              <p>
                نوع درمان پس از معاینه مشخص می‌شود. این دسته‌ها فقط برای هدایت سریع‌تر
                مراجعه هستند و جایگزین تشخیص پزشک نیستند.
              </p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <span className="service-index">{service.index}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a
                  data-whatsapp-link
                  data-conversion="appointment_whatsapp"
                  data-conversion-label={`service:${service.title}`}
                    href={`${whatsappBase}?text=${encodeURIComponent(`سلام، درباره «${service.title}» راهنمایی می‌خواهم.`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    پرسش درباره این خدمت
                    <span aria-hidden="true">←</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section local-discovery" id="local-dentistry">
          <div className="container discovery-shell">
            <div className="discovery-heading">
              <span className="section-kicker">دندانپزشکی در منطقه ۲۲ تهران</span>
              <h2>پیش از مراجعه، مسیرتان را مشخص کنید</h2>
              <p>
                اگر برای بررسی درد دندان، ایمپلنت، ترمیم، زیبایی، درمان ریشه، روکش یا
                مشاوره طرح درمان در منطقه ۲۲ تهران جست‌وجو می‌کنید، این صفحه اطلاعات
                اصلی تماس، خدمات و موقعیت دندانپزشکی دکتر مینا مازندرانی را یکجا ارائه می‌دهد.
              </p>
            </div>
            <div className="discovery-grid">
              {discoveryPoints.map((point, index) => (
                <article key={point.title}>
                  <span aria-hidden="true">{stepNumbers[index]}</span>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section journey" id="journey">
          <div className="container journey-grid">
            <div className="journey-copy">
              <span className="section-kicker">روند مراجعه</span>
              <h2>چهار مرحله ساده، بدون سردرگمی</h2>
              <p>
                مسیر مراجعه طوری طراحی شده که از اولین تماس تا پیگیری بعد از درمان،
                مرحله بعد برای شما روشن باشد.
              </p>
              <a className="text-link" data-conversion="phone_call" data-conversion-label="journey" href={`tel:${phoneInternational}`}>
                گفت‌وگوی مستقیم با مطب
                <span aria-hidden="true">←</span>
              </a>
            </div>

            <ol className="journey-list">
              {steps.map(([title, description], index) => (
                <li key={title}>
                  <span className="step-number">{stepNumbers[index]}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section app-section" id="app">
          <div className="container app-panel">
            <div className="app-logo-wrap" aria-hidden="true">
              <img src="/mina-logo.jpeg" alt="" width={180} height={180} />
              <span className="app-badge">مینا</span>
            </div>
            <div className="app-copy">
              <span className="section-kicker light">نسخه نصب‌شونده مینا</span>
              <h2>سایت را مثل یک برنامه روی گوشی داشته باشید</h2>
              <p>
                در مرورگرهای سازگار، سایت را به صفحهٔ اصلی گوشی اضافه کنید
                تا راه‌های تماس و مسیر مطب را آسان‌تر پیدا کنید.
              </p>
              <div className="app-features">
                <span>میان‌بر روی صفحهٔ اصلی</span>
                <span>راهنمای اختصاصی آیفون</span>
                <span>دسترسی به تماس و مسیر</span>
              </div>
            </div>
            <button className="button install-open" type="button" data-open-install data-conversion="pwa_install_open" data-conversion-label="app-section">
              نصب برنامه مینا
            </button>
          </div>
        </section>

        <section className="section location" id="location">
          <div className="container location-grid">
            <div className="location-card">
              <span className="section-kicker">موقعیت مطب</span>
              <h2>دندانپزشکی تخصصی صدف</h2>
              <p>
                تهران، منطقه ۲۲. موقعیت مطب را روی نقشه بررسی کنید
                و پیش از حرکت برای زمان مراجعه هماهنگ کنید.
              </p>
              <div className="location-actions">
                <a className="button button-primary" data-conversion="directions" data-conversion-label="location-card" href={directionsUrl} target="_blank" rel="noreferrer">
                  شروع مسیریابی از مبدأ من
                </a>
                <a className="button button-quiet" data-conversion="directions" data-conversion-label="owner-map-pin" href={mapPlaceUrl} target="_blank" rel="noreferrer">
                  نمایش مطب در نقشهٔ گوگل
                </a>
              </div>
              <LiveRouteButton
                destination={routeDestination}
                fallbackUrl={directionsUrl}
              />
              <div className="contact-inline">
                <span>برای هماهنگی پیش از حرکت</span>
                <a data-conversion="phone_call" data-conversion-label="location-card" href={`tel:${phoneInternational}`}><bdi>{phoneDisplay}</bdi></a>
              </div>
            </div>

            <div className="route-visual live-map-card" aria-label="نقشه آنلاین و راه‌های مسیریابی تا مطب">
              <div className="map-frame-wrap">
                <iframe
                  className="live-map-frame"
                  src={mapEmbedUrl}
                  title="نقشه آنلاین دندانپزشکی تخصصی صدف در منطقه ۲۲ تهران"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a className="map-fallback" data-conversion="directions" data-conversion-label="map-fallback" href={mapPlaceUrl} target="_blank" rel="noreferrer">
                  اگر نقشه باز نشد، موقعیت مطب را در گوگل ببینید
                </a>
              </div>
              <div className="route-copy">
                <span className="route-live"><i aria-hidden="true" /> موقعیت مطب روی نقشه</span>
                <h3>مسیر دلخواهتان را انتخاب کنید</h3>
                <p>در گوگل موقعیت مطب را ببینید. در نشان، بلد و Waze نام مطب جست‌وجو می‌شود؛ مقصد را پیش از شروع مسیر بررسی کنید.</p>
              </div>
              <div className="map-services">
                <a className="is-primary" data-conversion="directions" data-conversion-label="google-maps" href={directionsUrl} target="_blank" rel="noreferrer">Google Maps<small>مسیریابی از مبدأ</small></a>
                <a data-conversion="directions" data-conversion-label="waze" href={wazeUrl} target="_blank" rel="noreferrer">Waze<small>جست‌وجوی مقصد</small></a>
                <a data-conversion="directions" data-conversion-label="neshan" href={neshanUrl} target="_blank" rel="noreferrer">نشان<small>جست‌وجوی مقصد</small></a>
                <a data-conversion="directions" data-conversion-label="balad" href={baladUrl} target="_blank" rel="noreferrer">بلد<small>جست‌وجوی مقصد</small></a>
              </div>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="container faq-grid">
            <div className="faq-heading">
              <span className="section-kicker">پاسخ‌های روشن</span>
              <h2>سؤالات پرتکرار پیش از مراجعه</h2>
              <p>راهنمای هماهنگی نوبت، پیدا کردن مطب و استفاده از سایت روی گوشی.</p>
            </div>
            <div className="faq-list">
              {faqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}<span aria-hidden="true">＋</span></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <div>
              <span>برای شروع آماده‌اید؟</span>
              <h2>اولین قدم، یک گفت‌وگوی کوتاه و روشن است.</h2>
            </div>
            <div className="final-actions">
              <a className="button button-white" data-conversion="phone_call" data-conversion-label="final-cta" href={`tel:${phoneInternational}`}>
                تماس با مطب
              </a>
              <a
                className="button button-outline-white"
                data-whatsapp-link
                data-conversion="appointment_whatsapp"
                data-conversion-label="final-cta"
                href={`${whatsappBase}?text=${encodeURIComponent("سلام، برای دریافت نوبت پیام می‌دهم.")}`}
                target="_blank"
                rel="noreferrer"
              >
                پیام در واتساپ
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/mina-logo.jpeg" alt="" width={46} height={46} />
            <span>
              <strong>دندانپزشکی دکتر مینا مازندرانی</strong>
              <small>دندانپزشکی تخصصی صدف · تهران، منطقه ۲۲</small>
            </span>
          </div>
          <div className="footer-links">
            <a href="#services">خدمات</a>
            <a href="#local-dentistry">منطقه ۲۲</a>
            <a href="#journey">روند مراجعه</a>
            <a href="#location">موقعیت</a>
            <a href="#faq">سؤالات</a>
            <a href={`tel:${phoneInternational}`}>تماس</a>
          </div>
          <div className="update-state">
            <span className="update-dot" aria-hidden="true" />
            <span><strong>دسترسی به سایت</strong><small>تماس، خدمات و مسیر مطب</small></span>
          </div>
        </div>
        <div className="container footer-note">
          <span>اطلاعات این سایت جایگزین معاینه و تشخیص پزشکی نیست.</span>
          <span>پیش از مراجعه با مطب هماهنگ کنید.</span>
        </div>
      </footer>

      <SiteClient
        phone={phoneInternational}
        whatsappBase={whatsappBase}
        directionsUrl={directionsUrl}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
