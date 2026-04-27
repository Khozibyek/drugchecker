"use client";
import { useMemo, useState, useEffect } from "react";
import type { Severity, InteractionResult } from "@/types";
import {
  ArrowLeftRight,
  AlertCircle,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Shield,
  AlertTriangle,
} from "lucide-react";

interface SeverityConfig {
  label: string;
  sublabel: string;
  accentColor: string;
  stripClass: string;
  iconBgClass: string;
  iconTextClass: string;
  descBgClass: string;
  descBorderClass: string;
  Icon: React.ElementType;
}

function getSeverityConfig(sev: Severity): SeverityConfig {
  switch (sev) {
    case "MAJOR":
      return {
        label: "Өндөр",
        sublabel: "Хамт хэрэглэхийг ТУШААН хориглоно",
        accentColor: "#ef4444",
        stripClass: "bg-gradient-to-r from-red-500 to-rose-400",
        iconBgClass: "bg-red-50",
        iconTextClass: "text-red-500",
        descBgClass: "bg-red-50/40",
        descBorderClass: "border-red-100",
        Icon: ShieldAlert,
      };
    case "MODERATE":
      return {
        label: "Дунд",
        sublabel: "Эмчийн зөвлөгөөтэйгээр болгоомжтой хэрэглэнэ",
        accentColor: "#f97316",
        stripClass: "bg-gradient-to-r from-orange-500 to-amber-400",
        iconBgClass: "bg-orange-50",
        iconTextClass: "text-orange-500",
        descBgClass: "bg-orange-50/30",
        descBorderClass: "border-orange-100",
        Icon: Shield,
      };
    case "MINOR":
      return {
        label: "Бага",
        sublabel: "Тун болон хугацааг анхаарч хэрэглэнэ",
        accentColor: "#22c55e",
        stripClass: "bg-gradient-to-r from-emerald-500 to-green-400",
        iconBgClass: "bg-emerald-50",
        iconTextClass: "text-emerald-500",
        descBgClass: "bg-emerald-50/30",
        descBorderClass: "border-emerald-100",
        Icon: ShieldCheck,
      };
    default:
      return {
        label: "Тодорхойгүй",
        sublabel: "Мэргэжлийн зөвлөгөө авахыг зөвлөж байна",
        accentColor: "#64748b",
        stripClass: "bg-gradient-to-r from-slate-400 to-slate-300",
        iconBgClass: "bg-slate-100",
        iconTextClass: "text-slate-500",
        descBgClass: "bg-slate-50",
        descBorderClass: "border-slate-200",
        Icon: AlertTriangle,
      };
  }
}

function SeverityBar({ sev }: { sev: Severity }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const levels = ["MINOR", "MODERATE", "MAJOR"] as const;
  const activeIdx = levels.indexOf(sev as (typeof levels)[number]);
  const colors = ["bg-emerald-400", "bg-orange-400", "bg-red-500"];
  const labels = ["Бага", "Дунд", "Өндөр"];

  return (
    <div className="flex items-end gap-2">
      {levels.map((level, i) => (
        <div key={level} className="flex flex-col items-center gap-1.5">
          <div
            className={[
              "rounded-full transition-all duration-700 ease-out",
              i <= activeIdx ? colors[i] : "bg-slate-200",
              i === 0 ? "h-1.5" : i === 1 ? "h-2" : "h-2.5",
              animated ? "w-10 md:w-14" : "w-0",
            ].join(" ")}
          />
          <span
            className={[
              "text-[10px] font-semibold transition-all duration-300",
              i === activeIdx
                ? i === 0
                  ? "text-emerald-600"
                  : i === 1
                  ? "text-orange-600"
                  : "text-red-600"
                : "text-slate-300",
            ].join(" ")}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function DrugCard({
  name,
  inn,
  accentColor,
  iconBgClass,
  iconTextClass,
}: {
  name: string;
  inn: string;
  accentColor: string;
  iconBgClass: string;
  iconTextClass: string;
}) {
  return (
    <div
      className="relative flex items-center gap-2 overflow-hidden rounded-2xl border bg-white px-2.5 py-2.5 md:gap-3 md:px-4 md:py-3.5"
      style={{
        borderColor: `${accentColor}22`,
        boxShadow: `0 2px 12px ${accentColor}10, 0 1px 3px rgba(15,23,42,0.06)`,
      }}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl md:h-10 md:w-10 ${iconBgClass}`}
        style={{ boxShadow: `0 0 0 1px ${accentColor}18` }}
      >
        <Pill
          className={`h-3.5 w-3.5 md:h-[18px] md:w-[18px] ${iconTextClass}`}
        />
      </div>

      <div className="min-w-0">
        <div className="text-[12px] font-bold leading-tight text-slate-900 md:text-sm break-words">
          {name}
        </div>
        {inn && (
          <div className="text-[10px] font-medium text-slate-400 md:text-xs break-words">
            {inn}
          </div>
        )}
      </div>
    </div>
  );
}

function SeverityDropdown({ current }: { current: Severity }) {
  const [open, setOpen] = useState(false);

  const levels: {
    sev: Severity;
    label: string;
    sub: string;
    color: string;
    bg: string;
    Icon: React.ElementType;
  }[] = [
    {
      sev: "MINOR",
      label: "Бага",
      sub: "Тун, хугацааг анхаарна",
      color: "#16a34a",
      bg: "#f0fdf4",
      Icon: ShieldCheck,
    },
    {
      sev: "MODERATE",
      label: "Дунд",
      sub: "Эмчтэй зөвлөлдөж хэрэглэнэ",
      color: "#ea580c",
      bg: "#fff7ed",
      Icon: Shield,
    },
    {
      sev: "MAJOR",
      label: "Өндөр",
      sub: "Хамт хэрэглэхийг хориглоно",
      color: "#dc2626",
      bg: "#fef2f2",
      Icon: ShieldAlert,
    },
  ];

  const unknownFallback = {
    sev: "UNKNOWN" as Severity,
    label: "Тодорхойгүй",
    sub: "Мэргэжилтэнтэй зөвлөлдөнө үү",
    color: "#64748b",
    bg: "#f8fafc",
    Icon: AlertTriangle,
  };

  const active = levels.find((l) => l.sev === current) ?? unknownFallback;
  const isUnknown = active.sev === "UNKNOWN";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !isUnknown && setOpen((o) => !o)}
        disabled={isUnknown}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-all md:px-4 md:py-2"
        style={{
          backgroundColor: `${active.color}12`,
          border: `1.5px solid ${active.color}30`,
          cursor: isUnknown ? "default" : "pointer",
        }}
      >
        <active.Icon
          className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4"
          style={{ color: active.color }}
        />
        <span
          className="text-[12px] font-extrabold md:text-sm"
          style={{ color: active.color }}
        >
          {active.label}
        </span>
        {!isUnknown && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            style={{ color: active.color }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && !isUnknown && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)] md:w-72">
          {levels.map((l, i) => {
            const isCurrent = l.sev === current;
            return (
              <div
                key={l.sev}
                className={[
                  "flex items-start gap-3 px-4 py-3",
                  i !== 0 ? "border-t border-slate-100" : "",
                  isCurrent ? "opacity-100" : "opacity-50",
                ].join(" ")}
                style={{
                  backgroundColor: isCurrent ? `${l.color}08` : "white",
                }}
              >
                <div
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${l.color}15` }}
                >
                  <l.Icon className="h-3.5 w-3.5" style={{ color: l.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: l.color }}
                    >
                      {l.label}
                    </span>
                    {isCurrent && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: `${l.color}15`,
                          color: l.color,
                        }}
                      >
                        Одоогийн
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">{l.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function InteractionResultSection({
  result,
}: {
  result: InteractionResult | null;
}) {
  const [lang, setLang] = useState<"mn" | "en">("mn");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result?.type === "interaction") {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [result]);

  const config = useMemo(
    () =>
      result?.type === "interaction"
        ? getSeverityConfig(result.severity)
        : null,
    [result]
  );

  if (!result || result.type !== "interaction" || !config) return null;

  const { Icon } = config;
  const isMajor = result.severity === "MAJOR";
  const isModerate = result.severity === "MODERATE";

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className={[
          "overflow-hidden rounded-[20px] border border-slate-200 bg-white md:rounded-[28px]",
          "shadow-[0_20px_60px_rgba(15,23,42,0.10)]",
          "transition-all duration-500 ease-out",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        ].join(" ")}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="px-4 pb-6 pt-5 md:px-8 md:pb-8 md:pt-7">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 md:mb-4 md:text-[13px]">
            Үр дүн
          </h2>

          {/* Эмийн нэрүүд */}
          <div className="mb-4 grid grid-cols-[1fr_32px_1fr] items-center gap-1.5 md:mb-5 md:grid-cols-[1fr_48px_1fr] md:gap-3">
            <DrugCard
              name={result.drug_a_mn}
              inn={result.drug_a_inn}
              accentColor={config.accentColor}
              iconBgClass={config.iconBgClass}
              iconTextClass={config.iconTextClass}
            />
            <div className="flex items-center justify-center">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 md:h-10 md:w-10"
                style={{
                  borderColor: config.accentColor,
                  color: config.accentColor,
                  backgroundColor: `${config.accentColor}08`,
                }}
              >
                <ArrowLeftRight className="h-3 w-3 md:h-4 md:w-4" />
              </div>
            </div>
            <DrugCard
              name={result.drug_b_mn}
              inn={result.drug_b_inn}
              accentColor={config.accentColor}
              iconBgClass={config.iconBgClass}
              iconTextClass={config.iconTextClass}
            />
          </div>

          {/* Эрсдэлийн түвшин + анхааруулга нэг мөрөнд */}
          <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-5 md:gap-3">
            <SeverityDropdown current={result.severity} />
            {(isMajor || isModerate) && (
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
                style={{
                  borderColor: `${config.accentColor}25`,
                  backgroundColor: `${config.accentColor}06`,
                }}
              >
                <AlertCircle
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: config.accentColor }}
                />
                <p className="text-[11px] leading-tight text-slate-600 md:text-[12px]">
                  {isMajor
                    ? "Эмчийн зааварчилгаагүйгээр хамт хэрэглэхийг хориглоно."
                    : "Хэрэглэхийн өмнө эмчтэй зөвлөлдөж, тун болон хугацааг нарийн дагана уу."}
                </p>
              </div>
            )}
          </div>

          {/* Тайлбар */}
          <div
            className={`overflow-hidden rounded-xl border md:rounded-2xl ${config.descBorderClass}`}
          >
            <div className={`px-4 py-4 md:px-6 md:py-6 ${config.descBgClass}`}>
              <div
                className="rounded-xl py-1 pl-3 md:pl-4"
                style={{ borderLeft: `3px solid ${config.accentColor}50` }}
              >
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Тайлбар
                </span>
                <p className="text-[13px] leading-[1.85] text-slate-700 md:text-[15px] md:leading-[2.0]">
                  {result.description_mn}
                </p>
              </div>

              {result.description_en && (
                <div className="mt-3 md:mt-4">
                  <button
                    type="button"
                    onClick={() => setLang(lang === "en" ? "mn" : "en")}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 transition-colors hover:text-slate-600 active:text-slate-600"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className={`transition-transform duration-200 ${
                        lang === "en" ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M3 5l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Англи тайлбар унших
                  </button>

                  {lang === "en" && (
                    <div
                      className="mt-3 rounded-xl py-1 pl-3 md:pl-4"
                      style={{
                        borderLeft: `3px solid ${config.accentColor}30`,
                      }}
                    >
                      <p className="text-[12px] leading-[1.85] text-slate-500 md:text-[14px]">
                        {result.description_en}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
