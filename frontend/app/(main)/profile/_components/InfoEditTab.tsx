"use client";

import { useState } from "react";
import {
  User,
  X,
  Save,
  Mail,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { updateUser } from "@/lib/api";
import type { UserItem } from "@/types";

export default function InfoEditTab({
  currentUser,
  onCancel,
  onSave,
}: {
  currentUser: UserItem | null;
  onCancel: () => void;
  onSave: (updated: UserItem) => void;
}) {
  const [firstName, setFirstName] = useState(currentUser?.first_name || "");
  const [lastName, setLastName] = useState(currentUser?.last_name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Овог нэрээ бүрэн оруулна уу");
      setSuccess("");
      return;
    }

    if (!email.trim()) {
      setError("Имэйл хаягаа оруулна уу");
      setSuccess("");
      return;
    }

    if (!currentPassword.trim()) {
      setError("Өөрчлөлт хадгалахын тулд одоогийн нууц үгээ оруулна уу");
      setSuccess("");
      return;
    }

    if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
      setError("Шинэ нууц үг таарахгүй байна");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Нэвтрэх шаардлагатай байна");
        return;
      }

      const updated = await updateUser(token, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),

        current_password: currentPassword,
        new_password: newPassword || undefined,
        confirm_password: confirmPassword || undefined,
      });

      setSuccess("Мэдээлэл амжилттай хадгалагдлаа");
      onSave(updated);

      setTimeout(() => {
        onCancel();
      }, 800);
    } catch (err: any) {
      setSuccess("");
      setError(err.message || "Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h3 className="text-sm font-semibold text-slate-700">
            Мэдээлэл засах
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[10px] font-semibold lg:text-[12px] tracking-widest text-slate-400">
                Овог
              </p>
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50">
                  <User size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="Овгоо оруулна уу"
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-semibold lg:text-[12px] tracking-widest text-slate-400">
                Нэр
              </p>
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50">
                  <User size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder="Нэрээ оруулна уу"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-semibold lg:text-[12px] tracking-widest text-slate-400">
              Имэйл хаяг
            </p>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Имэйл хаягаа оруулна уу"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold lg:text-[12px] tracking-widest text-slate-400">
                  Шинэ нууц үг
                  <span className="lowercase">
                    (өөрчлөхгүй бол хоосон орхи)
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50">
                    <Lock size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Шинэ нууц үгээ оруулна уу"
                  />
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-semibold lg:text-[12px] tracking-widest text-slate-400">
                  Шинэ нууц үг давтах
                </p>
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50">
                    <Lock size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Шинэ нууц үгээ давтан оруулна уу"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <p className="mb-1.5 text-[10px] font-semibold lg:text-[12px] tracking-widest text-slate-400">
              Өөрчлөлт хадгалахын тулд одоогийн нууц үгээ оруулна уу.
            </p>

            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Одоогийн нууц үг"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Цуцлах
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}
