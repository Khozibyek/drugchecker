"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type InteractionDataItem = {
  drugbank_id: string;
  drug_name: string;
  interacts_with_id: string;
  description: string;
};

export default function InteractionsDataPage() {
  const router = useRouter();
  const [interactions, setInteractions] = useState<InteractionDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 100;

  const fetchInteractions = async (query = "") => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/data/interactions?q=${encodeURIComponent(query)}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setInteractions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Interactions fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const filtered = interactions.filter(
    (i) =>
      i.drug_name.toLowerCase().includes(search.toLowerCase()) ||
      i.drugbank_id.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            fetchInteractions(e.target.value);
          }}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="border-b-2 border-slate-200 bg-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Эмийн нэр
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Харилцан үйлчлэлтэй эм
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Тайлбар
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-slate-400"
                    >
                      Мэдээлэл олдсонгүй
                    </td>
                  </tr>
                ) : (
                  paginated.map((i, index) => (
                    <tr
                      key={`${i.drugbank_id}-${index}`}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                        {i.drugbank_id}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-800 min-w-[150px]">
                        {i.drug_name}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono min-w-[120px]">
                        {i.interacts_with_id}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600 max-w-[400px]">
                        <p className="line-clamp-2">{i.description}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}
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
    </div>
  );
}
