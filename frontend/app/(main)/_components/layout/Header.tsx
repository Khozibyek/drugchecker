"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Container from "./Container";
import { X, Menu, HelpCircle, User, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const openMenu = () => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeMenu = () => {
    setOpen(false);
    setTimeout(() => setMounted(false), 260);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Esc дарвал хаах
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu]);

  useEffect(() => {
    document.body.style.overflow = mounted ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  return (
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(209, 213, 219, 0.4)",
      }}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100">
              <Image src="/logo.png" alt="DrugCheck" width={40} height={40} />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold text-gray-900">
                DrugCheck
              </div>
              <div className="text-xs text-gray-500 tracking-wide">
                Drug Interaction Checker
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className={`group relative flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                pathname === "/" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <Home
                className={`h-4 w-4 transition group-hover:text-blue-600 ${
                  pathname === "/" ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span className="relative">
                Эхлэх
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${
                    pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </span>
            </Link>

            <Link
              href="/about"
              className={`group relative flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                pathname === "/about" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <HelpCircle
                className={`h-4 w-4 transition group-hover:text-blue-600 ${
                  pathname === "/about" ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span className="relative">
                Мэдээлэл
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${
                    pathname === "/about" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </span>
            </Link>

            {isLoggedIn ? (
              <Link
                href="/profile"
                className={`group relative flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                  pathname === "/profile" ? "text-blue-600" : "text-gray-700"
                }`}
              >
                <User
                  className={`h-4 w-4 transition group-hover:text-blue-600 ${
                    pathname === "/profile" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span className="relative">
                  Профайл
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${
                      pathname === "/profile"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  pathname === "/login"
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                Нэвтрэх
              </Link>
            )}
          </nav>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mounted}
            onClick={() => (mounted ? closeMenu() : openMenu())}
            className="md:hidden rounded-xl border border-gray-200 p-2 hover:bg-gray-50"
          >
            <Menu className="h-5 w-5 text-gray-800" />
          </button>
        </div>
      </Container>
      {mounted && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            onClick={closeMenu}
            className={`absolute inset-0 transition-opacity duration-200 ${
              open ? "opacity-100 bg-black/30" : "opacity-0 bg-black/0"
            }`}
          />
          <div
            className={[
              "absolute left-0 right-0",
              "h-[60vh] w-full",
              "bg-white shadow-2xl border-t border-gray-200",
              "rounded-b-2xl",
              "origin-top",
              "transition-all duration-250 ease-out",
              open
                ? "opacity-100 translate-y-0 scale-y-100"
                : "opacity-0 -translate-y-2 scale-y-0",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100">
                  <img src="/logo.png" alt="" />
                </div>
                <div className="leading-tight">
                  <div className="text-lg font-semibold text-gray-900">
                    DrugCheck
                  </div>
                  <div className="text-xs lg:text-[12px] text-gray-500 tracking-wide">
                    Drug Interaction Checker
                  </div>
                </div>
              </Link>
              <button
                onClick={closeMenu}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                <X className="h-5 w-5 text-gray-800" />
              </button>
            </div>
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 hover:bg-gray-50"
              >
                <Home className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-semibold">Эхлэх</span>
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 hover:bg-gray-50"
              >
                <HelpCircle className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-semibold">Мэдээлэл</span>
              </Link>
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 hover:bg-green-50"
                >
                  <User className="h-5 w-5 text-gray-800" />
                  <span className="text-sm font-semibold">Профайл</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 hover:bg-blue-50"
                >
                  <User className="h-5 w-5 text-gray-800" />
                  <span className="text-sm font-semibold">Нэвтрэх</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
