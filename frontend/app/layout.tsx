import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
// import Header from "./(main)/_components/layout/Header";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "DrugChecker",
  description: "Эм, эмийн харилцан үйлчлэл шалгагч",
  icons: {
    icon: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body
        className={`${inter.variable} ${montserrat.variable} min-h-screen bg-white text-slate-900`}
      >
        {/* <Header /> */}
        <main className="mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
