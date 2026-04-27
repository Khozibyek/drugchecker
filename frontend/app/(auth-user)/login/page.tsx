"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data, ok } = await loginUser(email, password);
      if (!ok) {
        setMsg(data.detail || "Алдаа гарлаа");
        return;
      }

      localStorage.setItem("token", data.access_token);
      setMsg("Амжилттай нэвтэрлээ");

      setTimeout(() => router.push("/"), 800);
    } catch {
      setMsg("Сервертэй холбогдож чадсангүй");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white sm:bg-[#F8FAFC] sm:flex sm:items-center sm:justify-center px-3 py-4">
      <div
        className="
          w-full min-h-screen bg-white
          sm:min-h-0 sm:max-w-[430px]
          rounded-[16px]
          sm:shadow-[0_12px_30px_rgba(2,6,23,0.10)]
          overflow-hidden
          flex flex-col
        "
      >
        {/* Card head */}
        <div
          className="
            w-full bg-[#2563EB]
            px-4 pt-10 pb-7
            sm:h-[150px] sm:p-[10px]
            flex flex-col items-center justify-center gap-[12px]
          "
        >
          <div className="w-[42px] h-[42px] rounded-[10px] bg-white/90 grid place-items-center">
            <img src="/logo.png" alt="DrugCheck Logo" />
          </div>

          <div className="text-center text-white">
            <div className="font-semibold text-[20px] leading-[20px]">
              DrugCheck
            </div>
            <div className="mt-2 font-semibold text-[14px] leading-[14px] text-white/95">
              DrugCheck системд нэвтрэх
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="flex flex-1 flex-col px-5 pt-8 pb-5 sm:px-[40px] sm:pt-[32px] sm:pb-[16px]">
          <form onSubmit={handleLogin} className="flex flex-1 flex-col">
            {/* Email field */}
            <div className="w-full flex flex-col gap-[6px]">
              <label className="text-[13px] font-light text-[#334155]">
                Имэйл хаяг
              </label>

              <div className="w-full h-[46px] rounded-[10px] border border-[#E5E7EB] bg-white px-[12px] flex items-center gap-[8px]">
                <Mail className="w-[20px] h-[20px] text-[#94A3B8] shrink-0" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full outline-none bg-transparent
                    text-[14px] font-light
                    placeholder:text-[#94A3B8]
                    text-[#0F172A]
                  "
                />
              </div>
            </div>

            {/* Password field */}
            <div className="mt-4 w-full flex flex-col gap-[6px]">
              <div className="w-full flex items-center justify-between gap-3">
                <label className="text-[13px] font-light text-[#334155]">
                  Нууц үг
                </label>

                <Link
                  href="/forgot-password"
                  type="button"
                  className="text-[12px] font-light text-[#2563EB] hover:underline shrink-0"
                >
                  Нууц үгээ мартсан?
                </Link>
              </div>

              <div className="w-full h-[48px] rounded-[10px] border border-[#E5E7EB] bg-white px-[12px] flex items-center gap-[8px]">
                <Lock className="w-[20px] h-[20px] text-[#94A3B8] shrink-0" />
                <input
                  type={show ? "text" : "password"}
                  placeholder="............"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full outline-none bg-transparent
                    text-[14px] font-light leading-[24px]
                    placeholder:text-[#94A3B8]
                    text-[#0F172A]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="text-[#94A3B8] hover:text-[#2563EB] transition shrink-0"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <p
              className={`mt-3 min-h-[20px] text-sm text-center ${
                msg.includes("Амжилттай") ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </p>

            {/* Login button */}
            <button
              type="submit"
              className="
                mt-4 w-full h-[48px]
                rounded-[12px]
                bg-[#2563EB]
                shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                px-[10px]
                flex items-center justify-center gap-[18px]
                text-white
                font-semibold text-[15px] leading-[24px]
                hover:brightness-110 active:brightness-95 transition
              "
            >
              Нэвтрэх <ArrowRight className="w-4 h-4" />
            </button>

            {/* Bottom links */}
            <div className="pt-14 pb-2 flex flex-col items-center gap-[6px]">
              <div className="text-[13px] text-[#475569] text-center">
                Бүртгэлгүй юу?{" "}
                <Link
                  href="/register"
                  className="text-[#2563EB] hover:underline"
                >
                  Бүртгүүлэх
                </Link>
              </div>

              <Link
                href="/"
                className="text-[13px] text-[#64748B] hover:underline text-center"
              >
                Нүүр хуудас руу буцах
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
