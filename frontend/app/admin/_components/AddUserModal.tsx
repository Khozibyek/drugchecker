"use client";

import { useState } from "react";
import { X, User, Mail, Lock, Save } from "lucide-react";

type UserItem = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
};

export default function AddUserModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (user: UserItem) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }

    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгттэй байна.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
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

      onAdd(data);
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
          <h3 className="text-sm font-bold text-slate-800">Хэрэглэгч нэмэх</h3>
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

          {/* Нууц үг */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Нууц үг
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? "Хадгалж байна..." : "Нэмэх"}
          </button>
        </div>
      </div>
    </div>
  );
}
