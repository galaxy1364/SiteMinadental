import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "دندانپزشکی دکتر مینا مازندرانی | منطقه ۲۲ تهران",
    template: "%s | دکتر مینا مازندرانی",
  },
  description:
    "وب‌سایت رسمی دندانپزشکی دکتر مینا مازندرانی در منطقه ۲۲ تهران؛ دسترسی سریع به تماس، واتساپ، خدمات و موقعیت مطب.",
  applicationName: "مینا",
  authors: [{ name: "دندانپزشکی دکتر مینا مازندرانی" }],
  creator: "دندانپزشکی دکتر مینا مازندرانی",
  category: "health",
  keywords: [
    "دکتر مینا مازندرانی",
    "دندانپزشکی منطقه ۲۲",
    "دندانپزشکی تخصصی صدف",
    "دندانپزشکی تهران",
    "ایمپلنت",
    "دندانپزشکی زیبایی",
  ],
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [{ url: "/mina-logo.jpeg", type: "image/jpeg", sizes: "1024x1024" }],
    shortcut: "/mina-logo.jpeg",
    apple: [{ url: "/mina-logo.jpeg", type: "image/jpeg", sizes: "1024x1024" }],
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "دندانپزشکی دکتر مینا مازندرانی",
    title: "دندانپزشکی دکتر مینا مازندرانی | منطقه ۲۲ تهران",
    description: "تماس مستقیم، درخواست نوبت و مسیریابی تا دندانپزشکی تخصصی صدف.",
    images: [{ url: "/mina-logo.jpeg", width: 1024, height: 1024, alt: "لوگوی رسمی دندانپزشکی دکتر مینا مازندرانی" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دندانپزشکی دکتر مینا مازندرانی",
    description: "دندانپزشکی در منطقه ۲۲ تهران",
    images: ["/mina-logo.jpeg"],
  },
  other: {
    "codex-preview": "development",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "مینا",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a6c66" },
    { media: "(prefers-color-scheme: dark)", color: "#083f3d" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
