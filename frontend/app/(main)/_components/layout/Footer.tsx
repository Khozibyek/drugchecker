"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Info,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full bg-[#050B1A]">
      {/* Санамж */}
      <section className="w-full bg-[#EFF6FF] px-4 py-8 md:px-[135px] md:py-[48px]">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 shrink-0 text-[#1E40AF]" />
            <div className="font-semibold text-[15px] text-[#1E40AF]">
              Эрүүл мэндийн санамж
            </div>
          </div>
          <p className="text-[13px] leading-[1.7] text-[#1E3A8A] md:text-[14px]">
            Энэхүү хэрэгсэл нь зөвхөн мэдээллийн зорилготой бөгөөд эмчийн
            зөвлөгөөг орлохгүй. Энд ямар нэгэн анхааруулга гарч ирээгүй нь
            тухайн эмүүд бүрэн аюулгүй гэсэн үг биш юм. Эм хэрэглэх, зогсоох,
            өөрчлөхөөс өмнө заавал эмчтэй зөвлөлдөнө үү.
          </p>
        </div>
      </section>

      {/* Үндсэн footer */}
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-10">
        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-[#0B1736] via-[#060C1C] to-[#050B1A] px-5 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] md:px-10 md:py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            {/* Брэнд */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-[12px] border border-white/10 bg-white/10">
                  <Image
                    src="/logo.png"
                    alt="DrugCheck Logo"
                    width={36}
                    height={36}
                  />
                </div>
                <div className="text-lg font-bold text-white">DrugCheck</div>
              </div>
              <p className="mt-4 text-[13px] leading-[1.7] text-white/70 md:mt-6 md:text-[14px]">
                Таны эрүүл мэндийн төлөөх ухаалаг туслах. Эмийн зохистой
                хэрэглээг хэвшүүлэхэд бид тусална.
              </p>
              <div className="mt-5 flex items-center gap-2 md:mt-8">
                {[
                  {
                    icon: <Facebook className="h-4 w-4 text-[#3B82F6]" />,
                    label: "Facebook",
                  },
                  {
                    icon: <Instagram className="h-4 w-4 text-[#3B82F6]" />,
                    label: "Instagram",
                  },
                  {
                    icon: <Twitter className="h-4 w-4 text-[#3B82F6]" />,
                    label: "Twitter",
                  },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    className="grid h-8 w-8 place-items-center rounded-[10px] border border-white/20 bg-white/5 transition hover:bg-white/10"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Цэс */}
            <div className="md:col-span-2">
              <div className="text-[15px] font-semibold text-white">Цэс</div>
              <div className="mt-4 flex flex-col gap-3 text-[13px] text-white/70 md:mt-5 md:text-[14px]">
                <Link className="hover:text-white transition" href="/">
                  Эхлэх
                </Link>
                <Link className="hover:text-white transition" href="/about">
                  Мэдээлэл
                </Link>
                <Link className="hover:text-white transition" href="/login">
                  Нэвтрэх
                </Link>
              </div>
            </div>

            {/* Холбоо барих */}
            <div className="md:col-span-3">
              <div className="text-[15px] font-semibold text-white">
                Холбоо барих
              </div>
              <div className="mt-4 flex flex-col gap-3 text-[13px] text-white/75 md:mt-5 md:text-[14px]">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-[#3B82F6]" />
                  <span>Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-[#3B82F6]" />
                  <span>+976 7711-XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#3B82F6]" />
                  <span>info@medicheck.mn</span>
                </div>
              </div>
            </div>

            {/* Санал хүсэлт */}
            <div className="md:col-span-3">
              <div className="rounded-[16px] border border-white/20 bg-white/5 px-5 py-5">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-white">
                  <MessageSquare className="h-5 w-5 text-white/80" />
                  Санал хүсэлт
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/feedback")}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#2563EB] py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  Илгээх
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 md:mt-12" />

          <div className="mt-5 flex flex-col items-center gap-3 text-center md:mt-6 md:flex-row md:justify-between md:text-left">
            <div className="text-[12px] text-white/45 md:text-[13px]">
              © 2026 DrugCheck. Бүх эрх хуулиар хамгаалагдсан.
            </div>
            <div className="flex items-center gap-3 text-[12px] text-white/45 md:text-[13px]">
              <Link href="#" className="hover:text-white/70 transition">
                Үйлчилгээний нөхцөл
              </Link>
              <span className="text-white/20">•</span>
              <Link href="#" className="hover:text-white/70 transition">
                Нууцлалын бодлого
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
