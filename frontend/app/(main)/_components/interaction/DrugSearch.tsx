"use client";

import { useEffect, useRef, useState } from "react";
import type { Drug } from "@/types";
import { searchDrugs } from "@/lib/api";

type Props = {
  onAdd: (drug: Drug) => void;
  onSearchStateChange?: (isSearching: boolean) => void;
};

export default function DrugSearch({ onAdd, onSearchStateChange }: Props) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Drug[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState(
    "Хамгийн багадаа 2 тэмдэгт оруулна уу"
  );
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchCardRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const reqIdRef = useRef(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const selectDrug = (drug: Drug) => {
    onAdd(drug);
    setQuery("");
    setMatches([]);
    setShowHint(false);
    setActiveIndex(-1);
    onSearchStateChange?.(true);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showHint || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? matches.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? matches[activeIndex] : matches[0];
      if (target) selectDrug(target);
    } else if (e.key === "Escape") {
      setShowHint(false);
      setActiveIndex(-1);
    }
  };

  const updateHint = async (val: string) => {
    const q = val.trim();
    setQuery(val);
    setActiveIndex(-1);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (q.length === 0) {
      setHintText("Хамгийн багадаа 2 тэмдэгт оруулна уу");
      setMatches([]);
      setShowHint(true);
      setLoading(false);
      return;
    }

    if (q.length < 2) {
      setHintText("Үргэлжлүүлэн бичнэ үү...");
      setMatches([]);
      setShowHint(true);
      setLoading(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const reqId = ++reqIdRef.current;
      setLoading(true);
      try {
        const results = await searchDrugs(q);
        if (reqId !== reqIdRef.current) return;
        const normalized = Array.isArray(results) ? results : [];
        if (normalized.length === 0) {
          setHintText("Тохирох эм олдсонгүй");
          setMatches([]);
        } else {
          setMatches(normalized.slice(0, 10));
        }
        setShowHint(true);
      } catch {
        if (reqId !== reqIdRef.current) return;
        setHintText("Холболтын алдаа гарлаа");
        setMatches([]);
        setShowHint(true);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    }, 250);
  };

  const expandSearch = () => {
    onSearchStateChange?.(true);
    setShowHint(true);
  };

  const collapseSearch = () => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (searchCardRef.current && !searchCardRef.current.contains(active)) {
        onSearchStateChange?.(false);
        setShowHint(false);
        setActiveIndex(-1);
      }
    }, 250);
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-[640px] px-0 transition-all duration-300">
      <div ref={searchCardRef} className="relative">
        <div className="overflow-hidden rounded-2xl border border-[#d1d5db] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2 rounded-2xl border border-[#9ca3af] bg-white px-3 py-3 transition-all duration-200 focus-within:border-2 focus-within:border-[#3b82f6] md:gap-3 md:px-4 md:py-[14px]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              className="shrink-0 rounded-full bg-slate-50 p-[5px] md:h-[26px] md:w-[26px] md:p-[6px]"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              ref={inputRef}
              className="flex-1 border-none bg-transparent p-0 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 md:text-base"
              placeholder="Эмийн нэрээр хайх..."
              value={query}
              onKeyDown={handleKey}
              onChange={(e) => updateHint(e.target.value)}
              onFocus={expandSearch}
              onBlur={collapseSearch}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            {query && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery("");
                  setMatches([]);
                  setShowHint(false);
                  setActiveIndex(-1);
                  inputRef.current?.focus();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {showHint && (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[280px] overflow-y-auto rounded-2xl border border-[#d1d5db] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.10)] md:max-h-[320px]">
            {loading ? (
              <div className="px-4 py-3 text-left text-[10px] text-slate-500 md:pl-[50px]">
                Хайж байна...
              </div>
            ) : matches.length > 0 ? (
              <div>
                {matches.map((d, i) => (
                  <div
                    key={d.drug_id}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectDrug(d)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`cursor-pointer border-t border-[#f1f5f9] px-4 py-3 text-left transition-colors active:bg-blue-50 md:pl-[50px] ${
                      activeIndex === i ? "bg-[#dbeafe]" : "hover:bg-[#f8fafc]"
                    }`}
                  >
                    <div className="text-[12px] font-medium text-slate-900">
                      {d.drug_mn}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {d.drug_inn}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-left text-[11px] text-slate-500 md:pl-[50px]">
                {hintText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
