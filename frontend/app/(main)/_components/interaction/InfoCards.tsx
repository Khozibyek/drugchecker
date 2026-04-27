"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { useMemo, useState } from "react";

const INFO_CARD_DATA = [
  {
    title: "Анхааруулга",
    desc: "Эмийн харилцан үйлчлэл нь эрсдэл дагуулж болзошгүй. Хамт хэрэглэхийн өмнө мэргэжлийн зөвлөгөө авна уу.",
    iconType: "alert" as const,
    accent: "#ef4444",
    accentBg: "#fef2f2",
    accentBorder: "#fecaca",
  },
  {
    title: "Зөвлөмж",
    desc: "Шинэ эм эхлэх, тун өөрчлөх үед харилцан үйлчлэлийг заавал шалгаж хэвшинэ.",
    iconType: "shield" as const,
    accent: "#22c55e",
    accentBg: "#f0fdf4",
    accentBorder: "#bbf7d0",
  },
  {
    title: "Системийн тухай",
    desc: "Системийн зорилго, өгөгдлийн эх сурвалж болон хэрхэн ажилладаг талаар дэлгэрэнгүй мэдээлэл авна.",
    iconType: "info" as const,
    accent: "#f59e0b",
    accentBg: "#fffbeb",
    accentBorder: "#fde68a",
  },
];

export default function InfoCards() {
  const router = useRouter(); // ← component дотор байх ёстой
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cards = useMemo(
    () =>
      INFO_CARD_DATA.map((card) => ({
        ...card,
        Icon:
          card.iconType === "alert"
            ? AlertTriangle
            : card.iconType === "shield"
            ? ShieldCheck
            : Info,
      })),
    []
  );

  const toggle = (e: React.MouseEvent, i: number) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setOpenIndex((prev) => (prev === i ? null : i));
    }
  };

  return (
    <section className="px-3 pb-6 pt-5 md:px-6 md:pb-8 md:pt-6">
      <div className="mx-auto grid max-w-5xl gap-3 md:gap-5 md:grid-cols-3">
        {cards.map((card, i) => {
          const isOpen = openIndex === i;
          return (
            <Link
              key={card.title}
              href="/about"
              onClick={(e) => toggle(e, i)}
              className="group relative overflow-hidden rounded-2xl border bg-white text-left shadow-[0_2px_12px_rgba(15,23,42,0.06)] transition-all duration-200 active:scale-[0.99] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)] md:rounded-[20px]"
              style={{ borderColor: "rgb(226,232,240)" }}
            >
              {/* Зүүн accent зураас */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{
                  background: `linear-gradient(to bottom, ${card.accent}, ${card.accent}60)`,
                }}
              />

              {/* Header */}
              <div className="flex w-full items-center gap-3 px-5 py-4 text-left md:px-6 md:py-5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 md:h-10 md:w-10 md:rounded-[12px]"
                  style={{
                    backgroundColor: card.accentBg,
                    border: `1px solid ${card.accentBorder}`,
                  }}
                >
                  <card.Icon
                    className="h-4 w-4 md:h-[18px] md:w-[18px]"
                    style={{ color: card.accent }}
                  />
                </div>
                <h3 className="flex-1 text-[14px] font-bold leading-tight text-slate-900 md:text-[15px]">
                  {card.title}
                </h3>
                <ChevronRight
                  className="h-4 w-4 shrink-0 transition-transform duration-200"
                  style={{
                    color: card.accent,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </div>

              {/* Mobile accordion content */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out md:hidden"
                style={{
                  maxHeight: isOpen ? "200px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div
                  className="pb-5 pr-5"
                  style={{ paddingLeft: "calc(1.25rem + 36px + 12px)" }}
                >
                  <p className="text-[13px] leading-[1.7] text-slate-500">
                    {card.desc}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push("/about");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold"
                    style={{ color: card.accent }}
                  >
                    Дэлгэрэнгүй
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Desktop content */}
              <div className="hidden md:block">
                <p
                  className="pb-6 text-[13px] leading-[1.75] text-slate-500"
                  style={{
                    paddingLeft: "calc(1.5rem + 40px + 12px)",
                    paddingRight: "1.5rem",
                  }}
                >
                  {card.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
