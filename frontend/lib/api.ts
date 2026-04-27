import type { Drug } from "@/types";

export async function searchDrugs(query: string): Promise<Drug[]> {
  const res = await fetch(
    `/api/drugs/search?q=${encodeURIComponent(query)}&limit=10`
  );
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return data.items || [];
}

export async function checkInteraction(drugA: string, drugB: string) {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/interactions/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ drug_a: drugA, drug_b: drugB }),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return { data: await res.json(), ok: res.ok };
}

export async function registerUser(
  first_name: string,
  last_name: string,
  email: string,
  password: string
) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ first_name, last_name, email, password }),
  });
  return { data: await res.json(), ok: res.ok };
}

export async function getMe(token: string) {
  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function getHistory(token: string) {
  const res = await fetch("/api/history/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed");
  const data = await res.json();

  // Debug — backend юу буцаасныг харах
  console.log("getHistory raw response:", data);

  // Аль ч бүтцэд адил ажиллана
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.history)) return data.history;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export async function deleteHistory(id: number, token: string) {
  const res = await fetch(`/api/history/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function updateUser(
  token: string,
  data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    current_password: string;
    new_password?: string;
    confirm_password?: string;
  }
) {
  const res = await fetch("/api/auth/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Хадгалахад алдаа гарлаа");
  return result;
}

export async function forgotPassword(email: string) {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Код илгээхэд алдаа гарлаа.");
  return data;
}

export async function verifyCode(email: string, code: string) {
  const res = await fetch("/api/auth/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Код шалгахад алдаа гарлаа.");
  return data;
}

export async function resetPassword(
  email: string,
  code: string,
  new_password: string
) {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, new_password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.detail || "Нууц үг шинэчлэх үед алдаа гарлаа.");
  return data;
}

export async function sendFeedback(
  title: string,
  content: string,
  token: string
) {
  const res = await fetch("/api/feedback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
