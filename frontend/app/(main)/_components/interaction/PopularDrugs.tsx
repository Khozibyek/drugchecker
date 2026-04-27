"use client";

import { useRef, useState, useEffect } from "react";
import type { Drug } from "@/types";

type Props = {
  selected: Drug[];
  onAdd: (drug: Drug) => void;
  heroCompact?: boolean;
};

export default function PopularDrugs({ selected, onAdd, heroCompact }: Props) {
  const [popularDrugs, setPopularDrugs] = useState<Drug[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const didDrag = useRef(false);

  useEffect(() => {
    fetch(`/api/interactions/popular`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setPopularDrugs(data);
      })
      .catch(() => {});
  }, []);

  const isSelected = (id: string) => selected.some((d) => d.drug_id === id);

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 3) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  // Touch drag
  const onTouchStart = (e: React.TouchEvent) => {
    didDrag.current = false;
    startX.current = e.touches[0].pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const walk = startX.current - e.touches[0].pageX;
    if (Math.abs(walk) > 3) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current + walk;
  };

  if (popularDrugs.length === 0) return null;

  return (
    <div
      className={`mx-auto mt-4 max-w-[650px] transition-all duration-300 md:mt-7 ${
        heroCompact ? "-translate-y-[5px] opacity-60" : "opacity-100"
      }`}
    >
      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto py-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing px-8"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          {popularDrugs.map((drug) => {
            const sel = isSelected(drug.drug_id);
            return (
              <button
                key={drug.drug_id}
                type="button"
                onClick={() => {
                  if (didDrag.current) return;
                  onAdd(drug);
                }}
                className={[
                  "shrink-0 rounded-full border px-3 py-1.5 text-[10px] lg:text-[12px] font-medium",
                  "transition-all duration-200 ease-out",
                  "whitespace-nowrap outline-none",
                  "active:scale-95",
                  "hover:scale-110 hover:-translate-y-[1.1px]",
                  sel
                    ? "border-blue-400 text-blue-600 scale-110"
                    : "border-slate-300 text-[#4b5d79] hover:border-slate-300 hover:text-slate-800",
                ].join(" ")}
                style={{ transformOrigin: "center center" }}
              >
                {drug.drug_mn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
