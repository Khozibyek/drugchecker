"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Activity, History, TrendingUp } from "lucide-react";

type DashboardData = {
  total_users: number;
  total_interactions: number;
  total_history: number;
  recent_users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
  }[];
  recent_interactions: {
    email: ReactNode;
    last_name: ReactNode;
    first_name: ReactNode;
    id: number;
    drug_a_mn: string;
    drug_b_mn: string;
    severity: string;
    created_at: string;
  }[];
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

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }

        const json = await res.json();
        setData(json);
      } catch {
        console.error("Dashboard fetch error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-ls text-slate-600 mt-1">
          Системийн ерөнхий мэдээлэл
        </h2>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Нийт хэрэглэгч
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {data?.total_users}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Нийт харилцан үйлчлэл
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {data?.total_interactions}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50">
              <History className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              Нийт шалгалт
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {data?.total_history}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Сүүлд бүртгүүлсэн хэрэглэгчид */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">
              Сүүлд бүртгүүлсэн хэрэглэгчид
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.recent_users ?? []).map((i) => (
              <div
                key={i.id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {i.first_name} {i.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{i.email}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(i.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Сүүлд шалгагдсан харилцан үйлчлэлүүд */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">
              Сүүлд шалгагдсан харилцан үйлчлэлүүд
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.recent_interactions ?? []).map((i) => (
              <div
                key={i.id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {i.drug_a_mn} + {i.drug_b_mn}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold mt-1 ${severityStyle(
                      i.severity
                    )}`}
                  >
                    {severityLabel(i.severity)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(i.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
