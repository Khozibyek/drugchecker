"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import InteractionDetailModal from "../_components/InteractionDetailModal";

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
  count: number;
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

export default function InteractionsPage() {
  const router = useRouter();
  const [interactions, setInteractions] = useState<InteractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<InteractionItem | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchInteractions = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      try {
        const res = await fetch(`/api/admin/interactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin-login");
          return;
        }
        const data = await res.json();
        setInteractions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Interactions fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, [router]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && interactions.length > 0) {
      const found = interactions.find((i) => i.id === parseInt(id));
      if (found) setSelected(found);
    }
  }, [searchParams, interactions]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = interactions.filter(
    (i) =>
      i.drug_a_mn.toLowerCase().includes(search.toLowerCase()) ||
      i.drug_b_mn.toLowerCase().includes(search.toLowerCase()) ||
      i.drug_a_inn.toLowerCase().includes(search.toLowerCase()) ||
      i.drug_b_inn.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Харилцан үйлчлэл</h1>
        <p className="text-sm text-slate-500 mt-1">
          Нийт {interactions.length} мэдээлэл
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Эмийн нэрээр хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full min-w-[750px]">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr className="border-b-2 border-slate-200">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    #
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    Эм А
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    Эм Б
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    Эрсдэл
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    Хандалт
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    Огноо
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider w-10">
                    Харах
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-slate-400"
                    >
                      Мэдээлэл олдсонгүй
                    </td>
                  </tr>
                ) : (
                  paginated.map((i, index) => (
                    <tr
                      key={i.id}
                      onClick={() => setSelected(i)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="px-5 py-3 text-sm text-slate-400">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-800">
                          {i.drug_a_mn}
                        </p>
                        <p className="text-xs text-slate-400">{i.drug_a_inn}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-800">
                          {i.drug_b_mn}
                        </p>
                        <p className="text-xs text-slate-400">{i.drug_b_inn}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${severityStyle(
                            i.severity
                          )}`}
                        >
                          {severityLabel(i.severity)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-700">
                        {i.count || ""}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">
                        {formatDate(i.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(i);
                          }}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-600">
            {filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(page * PAGE_SIZE, filtered.length)}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
              )
              .map((p, i, arr) => (
                <Fragment key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="text-slate-400 text-xs px-1">...</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`grid h-7 w-7 place-items-center rounded-lg border text-xs font-medium transition ${
                      page === p
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                </Fragment>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <InteractionDetailModal
          interaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
