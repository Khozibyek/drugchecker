"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";
import { sendFeedback, getMe } from "@/lib/api";
import type { UserItem } from "@/types";

export default function FeedbackPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const meData = await getMe(token);
        setCurrentUser(meData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isClient, router]);

  const handleSend = async () => {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Гарчиг оруулна уу.");
      return;
    }

    if (!content.trim()) {
      setError("Санал хүсэлтээ оруулна уу.");
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      await sendFeedback(title, content, token);
      setSuccess("Санал хүсэлт амжилттай илгээгдлээ!");
      setTitle("");
      setContent("");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setError("Илгээхэд алдаа гарлаа.");
    } finally {
      setSending(false);
    }
  };

  if (!isClient || loading) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 py-16 md:py-20 mx-auto max-w-xl">
        {/* Desktop header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            Санал хүсэлт
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Таны санал хүсэлт бидэнд чухал.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* User info */}
          <div className="px-4 md:px-6 py-4 border-b border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">Илгээгч</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {currentUser?.first_name} {currentUser?.last_name}
            </p>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
          </div>

          <div className="px-4 md:px-6 py-4 space-y-4">
            {/* Гарчиг */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Гарчиг
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Санал хүсэлтийн гарчиг"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* Санал хүсэлт */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Санал хүсэлт
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Санал хүсэлтээ дэлгэрэнгүй бичнэ үү..."
                rows={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-600">
                {success}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 py-4 border-t border-slate-100">
            <button
              onClick={handleSend}
              disabled={sending}
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Илгээж байна..." : "Илгээх"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
