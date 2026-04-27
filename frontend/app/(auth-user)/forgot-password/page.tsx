"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    console.log("1. handleSend дуудагдлаа");
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Имэйл хаягаа оруулна уу.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email.trim());
      console.log("2. API response:", res);

      sessionStorage.setItem("reset_email", email.trim());
      console.log(
        "3. sessionStorage хадгалагдлаа:",
        sessionStorage.getItem("reset_email")
      );

      setMessage(res?.message || "Баталгаажуулах код амжилттай илгээгдлээ.");

      router.push("/verify-code");
      console.log("4. router.push дуудагдлаа");
    } catch (err: any) {
      console.log("АЛДАА:", err);
      setError(err?.message || "Код илгээх үед алдаа гарлаа.");
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
          Нууц үг сэргээх
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Бүртгэлтэй имэйл хаягаа оруулна уу. Бид таны имэйл рүү баталгаажуулах
          код илгээнэ.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Имэйл хаяг
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {error && (
            <div className="mt-4  bg-red-50 px-2 py-2 text-[12px] text-center text-red-600">
              {error}
            </div>
          )}
          <button
            onClick={handleSend}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Илгээж байна...
              </>
            ) : (
              <>
                Код илгээх
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Буцах товч */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex w-full items-center justify-center gap-2 mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </div>

        {message && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
