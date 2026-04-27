"use client";

import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";

type AdminInfo = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

export default function AdminProfileModal({
  admin,
  onClose,
}: {
  admin: AdminInfo;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Шинэ нууц үг хамгийн багадаа 6 тэмдэгттэй байна.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Шинэ нууц үг таарахгүй байна.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Алдаа гарлаа");
        return;
      }

      setSuccess("Нууц үг амжилттай солигдлоо!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-800">Админ профайл</h3>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Мэдээлэл */}
        <div className="px-6 py-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 shrink-0">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {admin.username}
              </p>
              <p className="text-xs text-slate-500">{admin.email}</p>
            </div>
          </div>
        </div>

        {/* Нууц үг солих */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Нууц үг солих
          </p>

          {/* Одоогийн нууц үг */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Одоогийн нууц үг
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Шинэ нууц үг */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Шинэ нууц үг
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Шинэ нууц үг давтах */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Шинэ нууц үг давтах
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
              {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Хаах
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}
