"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, User } from "lucide-react";

type HistoryItem = {
  id: number;
  drug_a_mn: string;
  drug_b_mn: string;
  drug_a_inn: string;
  drug_b_inn: string;
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA");
}

export default function UserHistoryModal({
  userId,
  email,
  onClose,
}: {
  userId: number;
  email: string;
  onClose: () => void;
}) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`/api/admin/users/${userId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch {
        console.error("History fetch error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Шалгасан мэдээлэл
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <User className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-blue-600 mt-0.5">{email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-400">Уншиж байна...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-400">
                Шалгасан мэдээлэл байхгүй
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => router.push(`/interactions?id=${h.id}`)}
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-100 transition cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {h.drug_a_mn} + {h.drug_b_mn}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {h.drug_a_inn} + {h.drug_b_inn}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${severityStyle(
                      h.severity
                    )}`}
                  >
                    {severityLabel(h.severity)}
                  </span>
                </div>
              ))}
            </div>
          )}
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
