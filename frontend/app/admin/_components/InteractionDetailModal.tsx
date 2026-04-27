"use client";

import { X } from "lucide-react";

type InteractionItem = {
  id: number;
  drug_a_mn: string;
  drug_b_mn: string;
  drug_a_inn: string;
  drug_b_inn: string;
  description_en: string;
  description_mn: string;
  severity: string;
  created_at: string;
};

function severityStyle(severity: string) {
  const s = severity?.toUpperCase();
  if (s === "MAJOR") return "bg-red-50 text-red-600 border-red-200";
  if (s === "MODERATE") return "bg-amber-50 text-amber-600 border-amber-200";
  if (s === "MINOR") return "bg-emerald-50 text-emerald-600 border-emerald-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function severityLabel(severity: string) {
  const s = severity?.toUpperCase();
  if (s === "MAJOR") return "Ноцтой";
  if (s === "MODERATE") return "Дунд";
  if (s === "MINOR") return "Бага";
  return "Тодорхойгүй";
}

export default function InteractionDetailModal({
  interaction,
  onClose,
}: {
  interaction: InteractionItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-800">
            Дэлгэрэнгүй мэдээлэл
          </h3>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {interaction.drug_a_mn} + {interaction.drug_b_mn}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {interaction.drug_a_inn} + {interaction.drug_b_inn}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${severityStyle(
                interaction.severity
              )}`}
            >
              {severityLabel(interaction.severity)}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold  tracking-widest text-slate-400 mb-1.5">
              Монгол тайлбар
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {interaction.description_mn || "Тайлбар байхгүй"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400 mb-1.5">
              Англи тайлбар
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              {interaction.description_en || "No description"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
}
