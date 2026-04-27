"use client";

import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";

type UserItem = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
};

export default function EditUserModal({
  user,
  onClose,
  onUpdate,
}: {
  user: UserItem;
  onClose: () => void;
  onUpdate: (updated: UserItem) => void;
}) {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!firstName || !lastName || !email) {
      setError("Овог, нэр, имэйлийг бөглөнө үү.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("Шинэ нууц үг хамгийн багадаа 6 тэмдэгттэй байна.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("Шинэ нууц үг таарахгүй байна.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      const body: Record<string, string> = {
        first_name: firstName,
        last_name: lastName,
        email,
      };

      if (newPassword) {
        body.new_password = newPassword;
      }

      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        if (typeof data.detail === "string") {
          setError(data.detail);
        } else {
          setError("Алдаа гарлаа");
        }
        return;
      }

      onUpdate(data);
      onClose();
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-800">Хэрэглэгч засах</h3>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-3">
          {/* Овог */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Овог
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Овог"
              />
            </div>
          </div>

          {/* Нэр */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Нэр
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Нэр"
              />
            </div>
          </div>

          {/* Имэйл */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Имэйл
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Хэсэг хуваагч */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] text-slate-400 font-medium">
              Нууц үг солих (заавал биш)
            </span>
            <div className="flex-1 h-px bg-slate-100" />
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
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Цуцлах
          </button>
          <button
            onClick={() => {
              if (confirm("Хадгалахдаа итгэлтэй байна уу?")) {
                handleSave();
              }
            }}
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
