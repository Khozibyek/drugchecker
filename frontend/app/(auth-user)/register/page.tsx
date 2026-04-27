"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const router = useRouter();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data, ok } = await registerUser(
        first_name,
        last_name,
        email,
        password
      );
      if (password !== confirmPassword) {
        setMsg("Нууц үг таарахгүй байна");
        return;
      }
      if (!ok) {
        setMsg(data.detail || "Алдаа гарлаа");
        return;
      }
      setMsg("Амжилттай бүртгэгдлээ");
      setTimeout(() => router.push("/login"), 1000);
    } catch {
      setMsg("Сервертэй холбогдож чадсангүй");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center px-4">
      {/* Card */}
      <div
        className="
          w-[430px] h-[690px]
          bg-white rounded-[16px]
          shadow-[0_12px_30px_rgba(2,6,23,0.10)]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="w-full h-[150px] bg-[#059669] p-[10px] flex flex-col items-center justify-center gap-[12px]">
          <div className="w-[42px] h-[42px] rounded-[10px] bg-white/90 grid place-items-center">
            <img src="/logo.png" alt="DrugCheck Logo" />
          </div>

          <div className="text-center text-white">
            <div className="font-semibold text-[20px] leading-[20px]">
              DrugCheck
            </div>
            <div className="mt-2 font-semibold text-[14px] leading-[14px] text-white/95">
              DrugCheck системд бүртгүүлэх
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full px-[40px] pt-[28px] pb-[16px] flex flex-col gap-[18px]">
          {/* Name */}
          <form onSubmit={handleRegister}>
            <div className="w-full flex flex-col gap-[6px]">
              <label className="text-[13px] font-light text-[#334155]">
                Овог нэр
              </label>
              <div className="relative w-full h-[44px]">
                <input
                  type="text"
                  placeholder="Овог нэрээ бичнэ үү"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="
                  w-full h-full
                  rounded-[10px]
                  border border-[#E5E7EB]
                  bg-white
                  pl-[44px] pr-[12px]
                  outline-none
                  text-[14px] font-light
                  placeholder:text-[#94A3B8]
                  text-[#0F172A]
                "
                />
                <User className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#94A3B8]" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-[6px]">
              <label className="text-[13px] font-light text-[#334155]">
                Таны нэр
              </label>
              <div className="relative w-full h-[44px]">
                <input
                  type="text"
                  placeholder="Нэрээ бичнэ үү"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="
                  w-full h-full
                  rounded-[10px]
                  border border-[#E5E7EB]
                  bg-white
                  pl-[44px] pr-[12px]
                  outline-none
                  text-[14px] font-light
                  placeholder:text-[#94A3B8]
                  text-[#0F172A]
                "
                />
                <User className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#94A3B8]" />
              </div>
            </div>

            {/* Email */}
            <div className="w-full flex flex-col gap-[6px]">
              <label className="text-[13px] font-light text-[#334155]">
                Имэйл хаяг
              </label>
              <div className="relative w-full h-[44px]">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                  w-full h-full
                  rounded-[10px]
                  border border-[#E5E7EB]
                  bg-white
                  pl-[44px] pr-[12px]
                  outline-none
                  text-[14px] font-light
                  placeholder:text-[#94A3B8]
                  text-[#0F172A]
                "
                />
                <Mail className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#94A3B8]" />
              </div>
            </div>

            {/* Password */}
            <div className="w-full flex flex-col gap-[6px]">
              <label className="text-[13px] font-light text-[#334155]">
                Нууц үг
              </label>
              <div className="relative w-full h-[44px]">
                <input
                  type={show1 ? "text" : "password"}
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                  w-full h-full
                  rounded-[10px]
                  border border-[#E5E7EB]
                  bg-white
                  pl-[44px] pr-[44px]
                  outline-none
                  text-[14px] font-light
                  placeholder:text-[#94A3B8]
                  text-[#0F172A]
                "
                />
                <Lock className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#94A3B8]" />
                <button
                  type="button"
                  onClick={() => setShow1((v) => !v)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#059669] transition"
                  aria-label="Toggle password"
                ></button>
              </div>
            </div>

            {/* Password repeat */}
            <div className="w-full flex flex-col gap-[6px]">
              <label className="text-[13px] font-light text-[#334155]">
                Нууц үг давтах
              </label>
              <div className="relative w-full h-[44px]">
                <input
                  type={show2 ? "text" : "password"}
                  placeholder="************"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="
                  w-full h-full
                  rounded-[10px]
                  border border-[#E5E7EB]
                  bg-white
                  pl-[44px] pr-[44px]
                  outline-none
                  text-[14px] font-light
                  placeholder:text-[#94A3B8]
                  text-[#0F172A]
                "
                />
                <Lock className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#94A3B8]" />
                <button
                  type="button"
                  onClick={() => setShow2((v) => !v)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#059669] transition"
                  aria-label="Toggle password confirm"
                ></button>
              </div>
            </div>
            <p
              className={`mt-2 text-sm text-center ${
                msg.includes("Амжилттай") ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </p>
            {/* Button */}
            <button
              type="submit"
              className="
              w-full h-[48px]
              rounded-[12px]
              bg-[#059669]
              shadow-[0_8px_20px_rgba(0,0,0,0.25)]
              px-[8px]
              flex items-center justify-center gap-[18px]
              text-white
              font-semibold text-[15px] leading-[24px]
              hover:brightness-110 active:brightness-95 transition
              mt-2
            "
            >
              Бүртгүүлэх <ArrowRight className="w-4 h-4" />
            </button>

            {/* Bottom links */}
            <div className="pt-[22px] flex flex-col items-center gap-[4px]">
              <div className="text-[13px] text-[#475569]">
                Бүртгэлтэй юу?{" "}
                <Link href="/login" className="text-[#2563EB] hover:underline">
                  Нэвтрэх
                </Link>
              </div>

              <Link
                href="/"
                className="text-[13px] text-[#64748B] hover:underline"
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
