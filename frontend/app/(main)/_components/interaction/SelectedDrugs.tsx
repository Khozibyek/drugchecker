"use client";
import { useState } from "react";
import { X, Pill, FlaskConical } from "lucide-react";
import type { Drug } from "@/types";

type Props = {
  selected: Drug[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheck: () => void;
  checking: boolean;
};

function DrugCard({
  drug,
  onRemove,
}: {
  drug: Drug;
  onRemove: (id: string) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const [touching, setTouching] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(String(drug.drug_id)), 220);
  };

  return (
    <div
      data-removing={removing}
      data-touching={touching}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      className={[
        "group relative inline-flex w-auto items-center gap-3 overflow-hidden",
        "rounded-2xl border border-blue-200/70 bg-white px-4 py-3",
        "shadow-[0_2px_8px_rgba(99,102,241,0.10),0_1px_2px_rgba(99,102,241,0.06)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_6px_20px_rgba(99,102,241,0.15),0_2px_6px_rgba(99,102,241,0.10)]",
        "data-[touching=true]:scale-[0.97] data-[touching=true]:shadow-sm",
        "data-[removing=true]:scale-90 data-[removing=true]:opacity-0 data-[removing=true]:translate-y-1",
        "animate-in fade-in slide-in-from-top-3 duration-300",
        "min-h-[48px]",
      ].join(" ")}
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
        <Pill className="h-4 w-4 text-indigo-500" />
      </span>

      <div className="flex flex-col">
        <span className="whitespace-nowrap text-sm font-bold leading-tight text-slate-800">
          {drug.drug_mn}
        </span>
        {drug.drug_inn && (
          <span className="whitespace-nowrap text-xs font-medium leading-tight text-slate-400">
            {drug.drug_inn}
          </span>
        )}
      </div>

      <button
        type="button"
        aria-label={`${drug.drug_mn} устгах`}
        onClick={handleRemove}
        className={[
          "ml-auto flex-shrink-0",
          "flex h-7 w-7 items-center justify-center rounded-full",
          "text-slate-300 transition-all duration-150",
          "hover:bg-red-50 hover:text-red-400 hover:scale-110",
          "opacity-100 sm:opacity-60 sm:group-hover:opacity-100",
          "active:scale-95",
        ].join(" ")}
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function SelectedDrugs({
  selected,
  onRemove,
  onClear,
  onCheck,
  checking,
}: Props) {
  const canCheck = selected.length === 2 && !checking;

  return (
    <section className="px-4 pt-4 md:px-6 md:pt-6">
      <div className="mx-auto max-w-2xl">
        {selected.length === 0 && (
          <div className="mb-3 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 py-8 text-slate-400 md:py-10">
            <FlaskConical className="h-7 w-7 opacity-30 md:h-8 md:w-8" />
            <p className="text-[13px] font-medium md:text-sm">
              Харилцан үйлчлэл шалгах 2 эмийг сонгоно уу
            </p>
          </div>
        )}

        {selected.length > 0 && (
          <div className="mb-5 flex flex-wrap items-start justify-center gap-3 md:mb-6">
            {selected.map((d) => (
              <DrugCard key={d.drug_id} drug={d} onRemove={onRemove} />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-slate-100 pt-5 md:pt-6">
          <div className="group relative w-full md:w-auto">
            <button
              type="button"
              onClick={onCheck}
              disabled={!canCheck}
              className={[
                "w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md md:w-auto",
                "bg-gradient-to-r from-blue-500 to-indigo-500",
                "transition-all duration-200",
                "hover:opacity-90 hover:shadow-lg hover:-translate-y-px",
                "active:scale-95 active:shadow-sm",
                "min-h-[48px]",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-md",
              ].join(" ")}
            >
              ХАРИЛЦАН ҮЙЛЧЛЭЛ ШАЛГАХ
            </button>

            {selected.length < 2 && !checking && (
              <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                2 эм сонгосны дараа шалгана
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClear}
            disabled={selected.length === 0}
            className={[
              "text-[13px] font-semibold text-red-400",
              "transition-all duration-150",
              "hover:text-red-600 hover:underline",
              "active:scale-95",
              "min-h-[44px] px-2",
              "disabled:cursor-not-allowed disabled:opacity-30",
            ].join(" ")}
          >
            АРИЛГАХ
          </button>
        </div>
      </div>
    </section>
  );
}
