"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { verifyCode } from "@/lib/api";

export default function VerifyCodePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("reset_email") || "";
    setEmail(stored);
  }, []);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setMessage("");
    setError("");

    const cleanCode = code.replace(/\D/g, "");

    if (!email.trim()) {
      setError("Имэйл олдсонгүй. Дахин оролдоно уу.");
      return;
    }

    if (!cleanCode) {
      setError("Баталгаажуулах кодоо оруулна уу.");
      return;
    }

    if (cleanCode.length !== 6) {
      setError("Код 6 оронтой байх ёстой.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyCode(email, cleanCode);
      setMessage(res.message || "Код амжилттай баталгаажлаа.");
      sessionStorage.setItem("reset_code", cleanCode);

      setTimeout(() => {
        router.push("/reset-password");
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Код шалгахад алдаа гарлаа.");
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
          Код баталгаажуулах
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Таны имэйл рүү илгээсэн 6 оронтой кодыг оруулна уу.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Mail className="h-4 w-4 text-slate-500" />
          <span className="truncate">{email}</span>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Баталгаажуулах код
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setCode(onlyDigits);
              }}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-lg tracking-[0.3em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {error && (
            <div className="mt-4  bg-red-50 px-2 py-2 text-[12px] text-center text-red-600">
              {error}
            </div>
          )}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Шалгаж байна...
              </>
            ) : (
              <>
                Код шалгах
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Буцах товч */}
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="inline-flex w-full items-center justify-center gap-2 mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
