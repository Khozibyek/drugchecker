"use client";

import { useState } from "react";
import { CalendarDays, Clock3, Trash2, ChevronDown, Pill } from "lucide-react";
import type { HistoryItem } from "@/types";
import { deleteHistory } from "@/lib/api";

/* ================= helpers ================= */

function formatDate(value?: string) {
  if (!value) return "Огноо байхгүй";
  return new Date(value).toLocaleDateString("en-CA");
}

function formatTime(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityLabel(severity: string) {
  const s = severity?.toUpperCase();
  if (s === "MAJOR") return "Ноцтой";
  if (s === "MODERATE") return "Дунд";
  if (s === "MINOR") return "Бага";
  return "Тодорхойгүй";
}

const severityStyle = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case "MAJOR":
      return "border-rose-200 bg-rose-50 text-rose-600";
    case "MODERATE":
      return "border-amber-200 bg-amber-50 text-amber-600";
    case "MINOR":
      return "border-emerald-200 bg-emerald-50 text-emerald-600";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const severityBarColor = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case "MAJOR":
      return "bg-rose-500";
    case "MODERATE":
      return "bg-amber-500";
    case "MINOR":
      return "bg-emerald-500";
    default:
      return "bg-slate-400";
  }
};

/* ================= component ================= */

export default function HistoryTab({
  history,
  onDelete,
}: {
  history: HistoryItem[];
  onDelete: (id: number) => void;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await deleteHistory(id, token);
    onDelete(id);
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 px-4 sm:px-6 md:mb-6 md:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <h2 className="text-[15px] font-bold tracking-tight text-slate-800 sm:text-lg">
            Шалгасан түүх
          </h2>
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-[2px] text-[11px] font-black text-slate-500">
            {history.length}
          </span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4 px-4 sm:px-6 md:px-8">
        {history.length === 0 ? (
          <div className="rounded-[24px] border border-slate-100 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
            Одоогоор шалгасан түүх байхгүй байна.
          </div>
        ) : (
          history.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`group overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
                  isExpanded
                    ? "border-blue-200 shadow-lg shadow-blue-100/40"
                    : "border-slate-100 shadow-sm hover:-translate-y-1 hover:border-slate-200 hover:shadow-md hover:shadow-blue-100/30"
                }`}
              >
                {/* Top */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex cursor-pointer flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:justify-between"
                >
                  {/* Left icon + text */}
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    <div
                      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 sm:h-12 sm:w-12 ${
                        isExpanded
                          ? "scale-105 border-blue-600 bg-blue-600 shadow-md shadow-blue-200"
                          : "border-blue-100 bg-blue-50 group-hover:scale-105 group-hover:border-blue-600 group-hover:bg-blue-600"
                      }`}
                    >
                      <Pill
                        className={`h-5 w-5 transition-colors duration-300 sm:h-6 sm:w-6 ${
                          isExpanded
                            ? "text-white"
                            : "text-blue-500 group-hover:text-white"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 break-words text-[14px] font-semibold leading-tight text-slate-800 sm:text-[16px]">
                        {item.drug_a_mn} + {item.drug_b_mn}
                      </div>

                      <div className="break-words text-[12px] font-medium tracking-wide text-slate-600 sm:text-xs">
                        {item.drug_a_inn} + {item.drug_b_inn}
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div
                      className={`rounded-full border px-3 py-[5px] text-[10px] font-bold uppercase tracking-wide ${severityStyle(
                        item.severity
                      )}`}
                    >
                      {severityLabel(item.severity)}
                    </div>

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                        isExpanded
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                      }`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[900px] border-t border-[#E8EEF7] bg-[#FCFDFE] opacity-100"
                      : "max-h-0 overflow-hidden opacity-0"
                  }`}
                >
                  <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                    <div className="rounded-[22px] border border-[#E8EEF7] bg-[#F8FBFF] p-4 shadow-[0_4px_14px_rgba(37,99,235,0.04)] sm:rounded-[24px] sm:p-5">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1 flex flex-col gap-3">
                          {item.description_mn && (
                            <div className="flex items-start gap-3">
                              <div
                                className="mt-1 w-[3px] self-stretch shrink-0 rounded-full"
                                style={{
                                  background: `linear-gradient(to bottom, ${
                                    item.severity?.toUpperCase() === "MAJOR"
                                      ? "#f43f5e"
                                      : item.severity?.toUpperCase() ===
                                        "MODERATE"
                                      ? "#f59e0b"
                                      : item.severity?.toUpperCase() === "MINOR"
                                      ? "#10b981"
                                      : "#94a3b8"
                                  }, transparent)`,
                                }}
                              />
                              <div>
                                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#94A3B8]">
                                  Монгол тайлбар
                                </p>
                                <p className="break-words text-[14px] font-medium italic leading-7 text-[#475569] sm:text-[15px] sm:leading-8">
                                  {item.description_mn}
                                </p>
                              </div>
                            </div>
                          )}

                          {item.description_en && (
                            <div className="flex items-start gap-3">
                              <div
                                className="mt-1 w-[3px] self-stretch shrink-0 rounded-full"
                                style={{
                                  background: `linear-gradient(to bottom, ${
                                    item.severity?.toUpperCase() === "MAJOR"
                                      ? "#f43f5e"
                                      : item.severity?.toUpperCase() ===
                                        "MODERATE"
                                      ? "#f59e0b"
                                      : item.severity?.toUpperCase() === "MINOR"
                                      ? "#10b981"
                                      : "#94a3b8"
                                  }, transparent)`,
                                }}
                              />
                              <div>
                                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#94A3B8]">
                                  Англи тайлбар
                                </p>
                                <p className="break-words text-[13px] leading-6 text-slate-600 sm:text-[14px] sm:leading-7">
                                  {item.description_en}
                                </p>
                              </div>
                            </div>
                          )}

                          {!item.description_mn && !item.description_en && (
                            <p className="text-[14px] text-[#94A3B8]">
                              Тайлбар байхгүй
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-[#94A3B8] sm:text-[13px]">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 shrink-0" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 shrink-0" />
                          <span>{formatTime(item.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex w-full items-center gap-3 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Устгах уу?")) {
                              handleDelete(item.id);
                            }
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] sm:flex-none"
                        >
                          <Trash2 className="h-4 w-4" />
                          Устгах
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
