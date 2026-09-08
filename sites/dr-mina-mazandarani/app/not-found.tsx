import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section>
        <span>۴۰۴</span>
        <h1>این صفحه پیدا نشد</h1>
        <p>نشانی واردشده در سایت دندانپزشکی دکتر مینا مازندرانی وجود ندارد.</p>
        <Link className="button button-primary" href="/">بازگشت به صفحه اصلی</Link>
      </section>
    </main>
  );
}
