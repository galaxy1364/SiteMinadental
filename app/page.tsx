/* Native images are intentional here: the logo is an exact owner-provided PWA asset. */
/* eslint-disable @next/next/no-img-element */
import { SiteClient } from "./site-client";

const phoneDisplay = "۰۹۱۰ ۵۳۰ ۶۱۴۲";
const phoneInternational = "+989105306142";
const whatsappBase = "https://wa.me/989105306142";
const mapPlaceUrl =
  "https://maps.google.com/?q=%D8%AF%D9%86%D8%AF%D8%A7%D9%86%D9%BE%D8%B2%D8%B4%DA%A9%DB%8C%20%D8%AA%D8%AE%D8%B5%D8%B5%DB%8C%20%D8%B5%D8%AF%D9%81%D8%8C%20District%2022,%20Tehran,%20Tehran%20Province&ftid=0x3f8de56cb097914d:0xfd5e3dc570462e50&entry=gps";
const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=%D8%AF%D9%86%D8%AF%D8%A7%D9%86%D9%BE%D8%B2%D8%B4%DA%A9%DB%8C+%D8%AA%D8%AE%D8%B5%D8%B5%DB%8C+%D8%B5%D8%AF%D9%81%2C+District+22%2C+Tehran%2C+Tehran+Province&travelmode=driving&dir_action=navigate";
const routeQuery = encodeURIComponent("دندانپزشکی تخصصی صدف، منطقه ۲۲ تهران");
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

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "دندانپزشکی دکتر مینا مازندرانی",
    alternateName: "دندانپزشکی تخصصی صدف",
    image: "/mina-logo.jpeg",
    telephone: phoneInternational,
    address: {
      "@type": "PostalAddress",
      addressLocality: "تهران",
      addressRegion: "منطقه ۲۲",
      addressCountry: "IR",
    },
    areaServed: "تهران، منطقه ۲۲",
    hasMap: mapPlaceUrl,
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
            <a href="#journey">روند مراجعه</a>
            <a href="#app">نسخه نصب‌شونده</a>
            <a href="#location">موقعیت</a>
          </nav>

          <a className="header-call" href={`tel:${phoneInternational}`}>
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
                ارتباط مستقیم، دسترسی سریع به موقعیت مطب و انتخاب آگاهانه مسیر درمان؛
                بدون فرم نمایشی و بدون وعده‌های تأییدنشده.
              </p>

              <div className="hero-actions" aria-label="راه‌های اقدام سریع">
                <a
                  className="button button-primary"
                  data-whatsapp-link
                  href={`${whatsappBase}?text=${encodeURIComponent("سلام، برای دریافت نوبت و مشاوره پیام می‌دهم.")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  درخواست نوبت در واتساپ
                  <span aria-hidden="true">←</span>
                </a>
                <a className="button button-secondary" href={directionsUrl} target="_blank" rel="noreferrer">
                  مسیریابی از موقعیت من
                </a>
              </div>

              <div className="trust-strip" aria-label="ویژگی‌های اصلی">
                <div>
                  <span className="trust-icon" aria-hidden="true">✓</span>
                  <span><strong>ارتباط واقعی</strong><small>تماس و واتساپ مستقیم</small></span>
                </div>
                <div>
                  <span className="trust-icon" aria-hidden="true">⌖</span>
                  <span><strong>پین ثبت‌شده</strong><small>موقعیت ارسالی مالک</small></span>
                </div>
                <div>
                  <span className="trust-icon" aria-hidden="true">↻</span>
                  <span><strong>همیشه تازه</strong><small>دریافت خودکار نسخه جدید</small></span>
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

        <section className="section journey" id="journey">
          <div className="container journey-grid">
            <div className="journey-copy">
              <span className="section-kicker">روند مراجعه</span>
              <h2>چهار مرحله ساده، بدون سردرگمی</h2>
              <p>
                مسیر مراجعه طوری طراحی شده که از اولین تماس تا پیگیری بعد از درمان،
                مرحله بعد برای شما روشن باشد.
              </p>
              <a className="text-link" href={`tel:${phoneInternational}`}>
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
              <span className="app-badge">PWA</span>
            </div>
            <div className="app-copy">
              <span className="section-kicker light">نسخه نصب‌شونده مینا</span>
              <h2>سایت را مثل یک برنامه روی گوشی داشته باشید</h2>
              <p>
                دسترسی سریع به نوبت، تماس و مسیر مطب؛ به‌همراه دریافت خودکار نسخه‌های جدید.
                پیشنهادهای نصب فقط پس از فعال‌شدن رسمی کمپین نمایش داده می‌شوند.
              </p>
              <div className="app-features">
                <span>آیکن واقعی روی Home Screen</span>
                <span>راهنمای اختصاصی آیفون</span>
                <span>به‌روزرسانی خودکار</span>
              </div>
            </div>
            <button className="button install-open" type="button" data-open-install>
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
                تهران، منطقه ۲۲. برای جلوگیری از خطای آدرس متنی، مسیر اصلی مستقیماً به
                پین ثبت‌شده‌ای که مالک ارسال کرده متصل است.
              </p>
              <div className="location-actions">
                <a className="button button-primary" href={directionsUrl} target="_blank" rel="noreferrer">
                  شروع مسیریابی از مبدأ من
                </a>
                <a className="button button-quiet" href={mapPlaceUrl} target="_blank" rel="noreferrer">
                  نمایش پین در Google Maps
                </a>
              </div>
              <div className="contact-inline">
                <span>برای هماهنگی پیش از حرکت</span>
                <a href={`tel:${phoneInternational}`}><bdi>{phoneDisplay}</bdi></a>
              </div>
            </div>

            <div className="route-visual" aria-label="راه‌های مسیریابی تا مطب">
              <div className="route-path" aria-hidden="true">
                <span className="route-origin">مبدأ شما</span>
                <span className="route-line" />
                <span className="route-pin"><i />مطب</span>
              </div>
              <div className="route-copy">
                <span className="route-live"><i aria-hidden="true" /> موقعیت ثبت‌شده مالک</span>
                <h3>مسیر دلخواهتان را انتخاب کنید</h3>
                <p>پین اصلی Google دقیقاً همان لینک ارسالی مالک است؛ سایر سرویس‌ها مقصد را با نام ثبت‌شده جست‌وجو می‌کنند.</p>
              </div>
              <div className="map-services">
                <a className="is-primary" href={directionsUrl} target="_blank" rel="noreferrer">Google Maps<small>مسیریابی از مبدأ</small></a>
                <a href={wazeUrl} target="_blank" rel="noreferrer">Waze<small>جست‌وجوی مقصد</small></a>
                <a href={neshanUrl} target="_blank" rel="noreferrer">نشان<small>جست‌وجوی مقصد</small></a>
                <a href={baladUrl} target="_blank" rel="noreferrer">بلد<small>جست‌وجوی مقصد</small></a>
              </div>
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
              <a className="button button-white" href={`tel:${phoneInternational}`}>
                تماس با مطب
              </a>
              <a
                className="button button-outline-white"
                data-whatsapp-link
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
            <a href="#journey">روند مراجعه</a>
            <a href="#location">موقعیت</a>
            <a href={`tel:${phoneInternational}`}>تماس</a>
          </div>
          <div className="update-state">
            <span className="update-dot" aria-hidden="true" />
            <span><strong>نسخه به‌روز</strong><small>بررسی خودکار در هر ورود</small></span>
          </div>
        </div>
        <div className="container footer-note">
          <span>اطلاعات این سایت جایگزین معاینه و تشخیص پزشکی نیست.</span>
          <span>نسخه ۲۰۲۶.۰۸.۰۵.۱</span>
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
