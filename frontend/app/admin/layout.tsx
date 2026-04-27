"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
// import AdminProfileModal from "./_components/AdminProfileModal";
import {
  LayoutDashboard,
  Users,
  Activity,
  MessageSquare,
  Database,
  LogOut,
  User,
  Lock,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Админ самбар", icon: LayoutDashboard },
  { href: "/admin/users", label: "Хэрэглэгчид", icon: Users },
  { href: "/admin/interactions", label: "Харилцан үйлчлэл", icon: Activity },
  { href: "/admin/feedbacks", label: "Санал хүсэлт", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{
    id: number;
    username: string;
    email: string;
    created_at: string;
  } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDataMenu, setShowDataMenu] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/admin/data")) {
      setShowDataMenu(false);
    }
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
        return;
      }
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAdminInfo({
          id: payload.admin_id,
          username: payload.username,
          email: payload.email,
          created_at: payload.created_at,
        });
      } catch {
        console.error("Token parse error");
      }
    }

    setAuthChecked(true);
  }, [pathname, router]);

  if (!authChecked) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Хамгийн багадаа 6 тэмдэгт байна.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Нууц үг таарахгүй байна.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
      const res = await fetch(`${BASE}/admin/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Алдаа гарлаа");
        return;
      }
      setSuccess("Амжилттай солигдлоо!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setSaving(false);
    }
  };

  function setShowPasswordModal(arg0: boolean) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="relative w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100">
            <Image src="/logo.png" alt="DrugCheck" width={32} height={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">DrugCheck</div>
            <div className="text-[10px] text-slate-500">Admin Panel</div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-3 mb-2">
            Үндсэн цэс
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Өгөгдөл dropdown */}
          <button
            onClick={() => setShowDataMenu((v) => !v)}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              pathname.startsWith("/admin/data")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4" />
              Өгөгдөл
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${
                showDataMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDataMenu && (
            <div className="ml-4 mt-1 space-y-1 border-l border-slate-100 pl-3">
              <Link
                href="/admin/data/drugs"
                className={`flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  pathname === "/admin/data/drugs"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                Эмийн нэршил
              </Link>
              <Link
                href="/admin/data/templates"
                className={`flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  pathname === "/admin/data/templates"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                Монгол тайлбар
              </Link>
              <Link
                href="/admin/data/interactions"
                className={`flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  pathname === "/admin/data/interactions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                Харилцан үйлчлэл
              </Link>
            </div>
          )}
        </nav>
        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            {/* User icon */}
            <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 shrink-0">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            {/* Нэр, имэйл */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {adminInfo?.username || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {adminInfo?.email || ""}
              </p>
            </div>
            {/* Гарах */}
            <button
              onClick={() => {
                if (confirm("Гарахдаа итгэлтэй байна уу?")) {
                  localStorage.removeItem("admin_token");
                  router.push("/admin/login");
                }
              }}
              className="text-slate-400 hover:text-red-500 transition shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          /
        </div>
      </aside>

      {/* Admin Profile Popup */}
      {showProfile && adminInfo && (
        <div className="fixed bottom-4 left-4 z-50 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-700">Админ профайл</p>
            <button
              onClick={() => setShowProfile(false)}
              className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
            >
              <X size={12} />
            </button>
          </div>

          {/* Мэдээлэл */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 shrink-0">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {adminInfo.username}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {adminInfo.email}
              </p>
            </div>
          </div>

          {/* Нууц үг солих accordion */}
          <button
            onClick={() => setShowPassword((v) => !v)}
            className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" />
              Нууц үг солих
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${
                showPassword ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Нууц үг солих форм */}
          {showPassword && (
            <div className="mt-2 space-y-2">
              <input
                type="password"
                placeholder="Одоогийн нууц үг"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
              />
              <input
                type="password"
                placeholder="Шинэ нууц үг"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
              />
              <input
                type="password"
                placeholder="Шинэ нууц үг давтах"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
              />
              {error && <p className="text-[10px] text-red-500">{error}</p>}
              {success && (
                <p className="text-[10px] text-emerald-500">{success}</p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 py-2 text-xs font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          )}

          {/* Гарах */}
          <button
            onClick={() => {
              if (confirm("Гарахдаа итгэлтэй байна уу?")) {
                localStorage.removeItem("admin_token");
                router.push("/admin/ogin");
              }
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition mt-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            Гарах
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
