"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Eye } from "lucide-react";

type FeedbackItem = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_name: string;
  user_email: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA");
}

export default function FeedbacksPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`/api/admin/feedbacks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Feedbacks fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="p-14">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Санал хүсэлт</h1>
        <p className="text-sm text-slate-500 mt-1">
          Нийт {feedbacks.length} санал хүсэлт
        </p>
      </div>

      {/* List */}
      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-100">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 tracking-wider">
                #
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 tracking-wider">
                Хэрэглэгч
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 tracking-wider">
                Гарчиг
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 tracking-wider">
                Тайлбар
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 tracking-wider">
                Огноо
              </th>
              <th className="px-5 py-3.5 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {feedbacks.map((f, index) => (
              <tr key={f.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 text-sm text-slate-400">
                  {index + 1}
                </td>
                <td className="px-5 py-3">
                  <p className="text-sm font-medium text-slate-800">
                    {f.user_name}
                  </p>
                  <p className="text-xs text-slate-400">{f.user_email}</p>
                </td>
                <td className="px-5 py-3 text-sm text-slate-700">{f.title}</td>
                <td className="px-5 py-3 text-sm text-slate-500 max-w-[250px]">
                  <p className="line-clamp-2">{f.content}</p>
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">
                  {formatDate(f.created_at)}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setSelected(f)}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-sm font-bold text-slate-800">
                {selected.title}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {selected.user_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selected.user_email}
                  </p>
                </div>
                <span className="ml-auto text-xs text-slate-400">
                  {formatDate(selected.created_at)}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {selected.content}
              </p>
            </div>

            <div className="border-t border-slate-100 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
