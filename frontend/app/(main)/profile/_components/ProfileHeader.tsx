"use client";

import { User, Mail, History, LogOut, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserItem } from "@/types";

export default function ProfileHeader({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
}: {
  currentUser: UserItem | null;
  activeTab: "history" | "info";
  onTabChange: (tab: "history" | "info") => void;
  onLogout: () => void;
}) {
  const router = useRouter();

  return (
    <div className="mb-4 md:mb-8 rounded-2xl md:rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
      {/* Top section */}
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5 md:p-8">
        {/* Avatar */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center active:scale-95 transition-all duration-150 shrink-0 group"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-0.7 transition-all duration-150" />
          </button>

          <div className="flex h-14 w-14 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-50 shadow-md transition-transform hover:scale-105">
            <User className="h-7 w-7 md:h-10 md:w-10 text-blue-300" />
          </div>

          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold text-slate-800 truncate">
              {currentUser ? `${currentUser.last_name}` : "Хэрэглэгч"}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs md:text-sm font-medium text-slate-400">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{currentUser?.email || "-"}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            if (confirm("Системээс гарах уу?")) onLogout();
          }}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 md:px-4 text-xs md:text-sm font-bold text-rose-500 transition-colors hover:bg-rose-100"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Гарах</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-slate-100">
        <button
          type="button"
          onClick={() => onTabChange("history")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-bold transition-all border-b-2 ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <History className="h-4 w-4" />
          Шалгасан түүх
        </button>

        <button
          type="button"
          onClick={() => onTabChange("info")}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-bold transition-all border-b-2 ${
            activeTab === "info"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          <User className="h-4 w-4" />
          Хувийн мэдээлэл
        </button>
      </div>
    </div>
  );
}
