// InfoTab.tsx
"use client";

import { User, Mail, LogOut, Pencil } from "lucide-react";
import type { UserItem } from "@/types";

function formatDate(value?: string) {
  if (!value) return "Огноо байхгүй";
  return new Date(value).toLocaleDateString("en-CA");
}

export default function InfoTab({
  currentUser,
  onLogout,
  onEdit,
}: {
  currentUser: UserItem | null;
  onLogout: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="text-sm font-semibold text-slate-700">
            Хувийн мэдээлэл
          </h3>
        </div>

        {/* Content */}
        <div className="divide-y divide-slate-100">
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 grid place-items-center shrink-0">
              <User size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Овог
              </p>
              <p className="text-sm text-slate-700 mt-0.5">
                {currentUser?.first_name || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 grid place-items-center shrink-0">
              <User size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Нэр
              </p>
              <p className="text-sm text-slate-700 mt-0.5">
                {currentUser?.last_name || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 grid place-items-center shrink-0">
              <Mail size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Имэйл хаяг
              </p>
              <p className="text-sm text-slate-700 mt-0.5">
                {currentUser?.email || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            <Pencil size={13} />
            Засах
          </button>

          {/* <button
            type="button"
            onClick={() => {
              if (confirm("Системээс гарах уу?")) onLogout();
            }}
            className="md:hidden inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-500 transition hover:bg-red-100"
          >
            <LogOut size={13} />
            Гарах
          </button> */}
        </div>
      </div>
    </div>
  );
}
