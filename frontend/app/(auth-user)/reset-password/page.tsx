"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LockKeyhole, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email") || "";
    const storedCode = sessionStorage.getItem("reset_code") || "";
    if (!storedEmail || !storedCode) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);
    setCode(storedCode);
  }, [router]);

  const handleReset = async () => {
    setMessage("");
    setError("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Шинэ нууц үгээ бүтэн оруулна уу.");
      return;
    }

    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгттэй байна.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(email, code, password);
      setMessage(res.message || "Нууц үг амжилттай шинэчлэгдлээ.");

      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_code");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Нууц үг шинэчлэх үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
            <Image src="/logo.png" alt="DrugCheck" width={40} height={40} />
          </div>
          <span className="text-sm font-semibold text-slate-700">
            DrugCheck
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Шинэ нууц үг оруулах
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Баталгаажуулалт амжилттай боллоо, шинэ нууц үгээ оруулна уу.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Имэйл
            </label>
            <input
              value={email}
              readOnly
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Шинэ нууц үг
            </label>
            <input
              type="password"
              placeholder="Шинэ нууц үг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Шинэ нууц үг давтах
            </label>
            <input
              type="password"
              placeholder="Нууц үгээ давтан оруулна уу"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {error && (
            <div className="mt-4  bg-red-50 px-2 py-2 text-[12px] text-center text-red-600">
              {error}
            </div>
          )}
          <button
            onClick={handleReset}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Хадгалж байна...
              </>
            ) : (
              "Нууц үг шинэчлэх"
            )}
          </button>

          {/* Буцах товч */}
          <button
            type="button"
            onClick={() => router.push("/verify-code")}
            className="inline-flex w-full items-center justify-center gap-2 mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </div>

        {message && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
