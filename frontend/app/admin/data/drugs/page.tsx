"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";

import { Search, Pencil, Trash2, Save, X } from "lucide-react";

type DrugItem = {
  drug_id: string;
  mn_name: string;
  inn_name: string;
};

export default function DrugsDataPage() {
  const router = useRouter();
  const [drugs, setDrugs] = useState<DrugItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<DrugItem | null>(null);
  const [editMn, setEditMn] = useState("");
  const [editInn, setEditInn] = useState("");
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchDrugs = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`/api/admin/data/drugs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDrugs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Drugs fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrugs();
  }, [router]);

  useEffect(() => {
    console.log("editItem:", editItem);
  }, [editItem]);

  const handleEdit = (drug: DrugItem) => {
    setEditItem(drug);
    setEditMn(drug.mn_name);
    setEditInn(drug.inn_name);
  };

  const handleSave = async () => {
    if (!editItem) return;
    if (!confirm("Хадгалахдаа итгэлтэй байна уу?")) return;

    setSaving(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/admin/data/drugs/${editItem.drug_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mn_name: editMn, inn_name: editInn }),
      });

      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setDrugs(
          drugs.map((d) =>
            d.drug_id === editItem.drug_id
              ? { ...d, mn_name: editMn, inn_name: editInn }
              : d
          )
        );
        setEditItem(null);
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (drug_id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/admin/data/drugs/${drug_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDrugs(drugs.filter((d) => d.drug_id !== drug_id));
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const filtered = drugs.filter(
    (d) =>
      d.mn_name.toLowerCase().includes(search.toLowerCase()) ||
      d.inn_name.toLowerCase().includes(search.toLowerCase()) ||
      d.drug_id.toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Эмийн нэршил</h1>
        <p className="text-sm text-slate-500 mt-1">Нийт {drugs.length} эм</p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Нэрээр хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr className="border-b-2 border-slate-200 bg-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600  tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    Монгол нэр
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 tracking-wider">
                    INN нэр
                  </th>
                  <th className="px-5 py-3.5 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-slate-400"
                    >
                      Мэдээлэл олдсонгүй
                    </td>
                  </tr>
                ) : (
                  paginated.map((d, index) => (
                    <tr
                      key={`${d.drug_id}-${index}`}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                        {d.drug_id}
                      </td>
                      <td className="px-5 py-3">
                        {editItem?.drug_id === d.drug_id ? (
                          <input
                            value={editMn}
                            onChange={(e) => setEditMn(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
                          />
                        ) : (
                          <span className="text-sm text-slate-800">
                            {d.mn_name}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editItem?.drug_id === d.drug_id ? (
                          <input
                            value={editInn}
                            onChange={(e) => setEditInn(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
                          />
                        ) : (
                          <span className="text-sm text-slate-500">
                            {d.inn_name}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editItem?.drug_id === d.drug_id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditItem(null)}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(d)}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(d.drug_id)}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-600">
            {(page - 1) * PAGE_SIZE + 1}–
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
    </div>
  );
}
