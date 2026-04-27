"use client";

import { useRef, useState, useEffect } from "react";
import { AlertCircle, Info } from "lucide-react";
import DrugSearch from "./_components/interaction/DrugSearch";
import PopularDrugs from "./_components/interaction/PopularDrugs";
import SelectedDrugs from "./_components/interaction/SelectedDrugs";
import InfoCards from "./_components/interaction/InfoCards";
import InteractionResultSection from "./_components/interaction/InteractionResult";
import MoleculeBackground from "./_components/layout/MoleculeBackground";
import { checkInteraction } from "@/lib/api";
import type { InteractionResult, Drug } from "@/types";

export default function Home() {
  const [selected, setSelected] = useState<Drug[]>([]);
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);
  const heroCompact = isSearching || selected.length > 0;

  const handleAdd = (drug: Drug) => {
    setSelected((prev) => {
      if (prev.some((d) => d.drug_id === drug.drug_id)) return prev;
      if (prev.length >= 2) return prev;
      return [...prev, drug];
    });
    setIsSearching(true);
  };

  const removeSelected = (id: string) => {
    setSelected((prev) => {
      const next = prev.filter((d) => d.drug_id !== id);
      if (next.length === 0) setIsSearching(false);
      return next;
    });
    setResult(null);
  };

  const clearAll = () => {
    setSelected([]);
    setResult(null);
    setIsSearching(false);
  };

  const handleCheck = async () => {
    if (selected.length !== 2 || checking) return;
    setChecking(true);
    setResult(null);
    try {
      const data = await checkInteraction(
        selected[0].drug_inn || selected[0].drug_mn,
        selected[1].drug_inn || selected[1].drug_mn
      );
      if (data?.error) {
        setResult({ type: "error", error: data.error });
        return;
      }
      if (!data?.has_interaction) {
        setResult({
          type: "no_interaction",
          has_interaction: false,
          message: data?.message || "Харилцан үйлчлэл олдсонгүй",
          drug_a_mn: selected[0].drug_mn,
          drug_b_mn: selected[1].drug_mn,
        });
        return;
      }
      setResult({
        type: "interaction",
        has_interaction: true,
        severity:
          data.severity === "MAJOR" ||
          data.severity === "MODERATE" ||
          data.severity === "MINOR"
            ? data.severity
            : "unknown",
        matched_keyword: data.matched_keyword || null,
        description_mn: data.description_mn || "Тайлбар байхгүй",
        description_en: data.description_en || "",
        drug_a_id: data.drug_a_id || "",
        drug_a_inn: data.drug_a_inn || selected[0].drug_inn || "",
        drug_a_mn: data.drug_a_mn || selected[0].drug_mn || "",
        drug_b_id: data.drug_b_id || "",
        drug_b_inn: data.drug_b_inn || selected[1].drug_inn || "",
        drug_b_mn: data.drug_b_mn || selected[1].drug_mn || "",
      });
    } catch {
      setResult({ type: "error", error: "Backend руу холбогдож чадсангүй." });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      const y =
        resultRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Hero ── */}
      <section
        className={`relative px-4 text-center transition-all duration-500 md:px-10 ${
          heroCompact
            ? "pb-6 pt-10 md:pb-10 md:pt-[58px]"
            : "pb-10 pt-12 md:pb-[72px] md:pt-24"
        }`}
      >
        <MoleculeBackground />

        <div className="relative z-10">
          <h1
            className={`font-black leading-[1.05] tracking-tight text-slate-900 transition-all duration-500 ${
              heroCompact
                ? "mb-3 text-[26px] tracking-[-0.5px] md:mb-[18px] md:text-[42px] md:tracking-[-1px]"
                : "mb-4 text-[34px] tracking-[-1px] md:mb-[26px] md:text-[64px] md:tracking-[-2.6px]"
            }`}
          >
            Эмийн харилцан
            <br />
            үйлчлэлийг <span className="text-[#7c83ff]">шалгах</span>
          </h1>

          <p
            className={`mx-auto leading-[1.6] text-[#4a5e80] transition-all duration-300 ${
              heroCompact
                ? "mb-4 max-w-[320px] text-[13px] opacity-30 md:mb-7 md:max-w-[700px] md:text-[17px]"
                : "mb-6 max-w-[320px] text-[14px] opacity-100 md:mb-[46px] md:max-w-[560px] md:text-[17px]"
            }`}
          >
            Та хэрэглэж буй эмүүдээ оруулж, тэдгээрийн аюулгүй байдлыг хялбархан
            шалгаарай
          </p>

          <div className="mx-auto max-w-[720px] px-0">
            <DrugSearch
              onAdd={handleAdd}
              onSearchStateChange={(open) => {
                if (selected.length > 0) {
                  setIsSearching(true);
                  return;
                }
                setIsSearching(open);
              }}
            />
          </div>

          <PopularDrugs
            selected={selected}
            onAdd={handleAdd}
            heroCompact={heroCompact}
          />

          <SelectedDrugs
            selected={selected}
            onRemove={removeSelected}
            onClear={clearAll}
            onCheck={handleCheck}
            checking={checking}
          />
        </div>
      </section>

      {/* ── Мэдээллийн картууд ── */}
      <InfoCards />

      {/* ── Үр дүн ── */}
      <div ref={resultRef} className="px-3 pb-10 pt-2 md:px-6 md:pb-16 md:pt-4">
        {(result?.type === "error" || result?.type === "no_interaction") && (
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center md:py-16">
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full md:mb-4 md:h-16 md:w-16 ${
                  result.type === "error" ? "bg-gray-100" : "bg-amber-50"
                }`}
              >
                {result.type === "error" ? (
                  <AlertCircle className="h-5 w-5 text-gray-400 md:h-7 md:w-7" />
                ) : (
                  <Info className="h-5 w-5 text-amber-500 md:h-7 md:w-7" />
                )}
              </div>

              <h3 className="text-sm font-semibold text-gray-900 md:text-lg">
                {result.type === "error"
                  ? "Эмийн нэр олдсонгүй"
                  : "Харилцан үйлчлэл олдсонгүй"}
              </h3>

              <p className="mt-2 max-w-[280px] text-[12px] leading-[1.7] text-gray-500 md:max-w-md md:text-sm md:leading-7">
                {result.type === "error"
                  ? "Таны оруулсан эмийн нэр манай өгөгдлийн санд бүртгэгдээгүй байна."
                  : "Энэ нь заавал аюулгүй гэсэн үг биш. Эрүүл мэндийн мэргэжилтэнтэй зөвлөлдөөрэй."}
              </p>
            </div>
          </div>
        )}

        {result?.type === "interaction" && (
          <InteractionResultSection result={result} />
        )}
      </div>
    </div>
  );
}
