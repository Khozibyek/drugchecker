"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Нэвтрэх мэдээлэл буруу байна");
        return;
      }

      localStorage.setItem("admin_token", data.access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <Image src="/logo.png" alt="DrugCheck" width={40} height={40} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">DrugCheck</div>
            <div className="text-xs text-slate-500">Админ хэсэг</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Нэвтрэх</h1>
        <p className="text-sm text-slate-500 mb-6">
          Зөвхөн админ хэрэглэгчид нэвтрэх боломжтой.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Имэйл хаяг
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="email"
                placeholder="admin@drugcheck.mn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Нууц үг
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Нэвтэрч байна...
              </>
            ) : (
              <>
                Нэвтрэх
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
