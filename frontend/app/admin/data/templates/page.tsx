"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Search, Pencil, Trash2, Save, X } from "lucide-react";

type TemplateItem = {
  id: string;
  keywords: string;
  template: string;
};

export default function TemplatesDataPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<TemplateItem | null>(null);
  const [editKeywords, setEditKeywords] = useState("");
  const [editType, setEditType] = useState("");
  const [editTemplate, setEditTemplate] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`/api/admin/data/templates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTemplates(
          Array.isArray(data)
            ? data.filter((t: TemplateItem) => t.keywords)
            : []
        );
      } catch (err) {
        console.error("Templates fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [router]);

  const handleEdit = (item: TemplateItem) => {
    setEditItem(item);
    setEditKeywords(item.keywords);
    setEditTemplate(item.template);
  };

  const handleSave = async () => {
    if (!editItem) return;
    if (!confirm("Хадгалахдаа итгэлтэй байна уу?")) return;

    setSaving(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/admin/data/templates/${editItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          keywords: editKeywords,
          interaction_type: editType,
          template: editTemplate,
        }),
      });

      if (res.ok) {
        setTemplates(
          templates.map((t) =>
            t.id === editItem.id
              ? {
                  ...t,
                  keywords: editKeywords,
                  interaction_type: editType,
                  template: editTemplate,
                }
              : t
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

  const handleDelete = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/admin/data/templates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTemplates(templates.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const filtered = templates.filter(
    (t) =>
      t.keywords.toLowerCase().includes(search.toLowerCase()) ||
      t.template.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-slate-800">Монгол тайлбар</h1>
        <p className="text-sm text-slate-500 mt-1">
          Нийт {templates.length} template
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Хайх..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="border-b-2 border-slate-200 bg-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Keywords
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-5 py-3.5 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-sm text-slate-400"
                    >
                      Мэдээлэл олдсонгүй
                    </td>
                  </tr>
                ) : (
                  paginated.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                        {t.id}
                      </td>
                      <td className="px-5 py-3 min-w-[180px]">
                        {editItem?.id === t.id ? (
                          <input
                            value={editKeywords}
                            onChange={(e) => setEditKeywords(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
                          />
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">
                            {t.keywords}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 min-w-[300px]">
                        {editItem?.id === t.id ? (
                          <textarea
                            value={editTemplate}
                            onChange={(e) => setEditTemplate(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
                          />
                        ) : (
                          <span className="text-sm text-slate-600 leading-relaxed">
                            {t.template}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editItem?.id === t.id ? (
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
                              onClick={() => handleEdit(t)}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
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
