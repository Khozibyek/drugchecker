"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./_components/ProfileHeader";
import HistoryTab from "./_components/HistoryTab";
import InfoTab from "./_components/InfoTab";
import InfoEditTab from "./_components/InfoEditTab";
import { getMe, getHistory } from "@/lib/api";
import type { UserItem, HistoryItem } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"history" | "info">("history");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient) return;

    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        setLoading(false);
        return;
      }

      try {
        const [meData, historyData] = await Promise.all([
          getMe(token),
          getHistory(token),
        ]);
        setCurrentUser(meData);
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isClient, router]);

  if (!isClient || loading) return null;

  /* if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FBFC] px-4">
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Уншиж байна...</p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="min-h-screen bg-[#F9FBFC] px-3 pt-4 font-sans text-slate-900 sm:px-5 sm:pt-6 md:pt-8">
      <div className="mx-auto w-full max-w-[900px]">
        <ProfileHeader
          currentUser={currentUser}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        />

        <div className="mt-4 md:mt-6">
          {activeTab === "history" ? (
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <HistoryTab
                history={history}
                onDelete={(id) =>
                  setHistory((prev) => prev.filter((h) => h.id !== id))
                }
              />
            </div>
          ) : isEditing ? (
            <InfoEditTab
              currentUser={currentUser}
              onCancel={() => setIsEditing(false)}
              onSave={(updated) => {
                setCurrentUser(updated);
                setIsEditing(false);
              }}
            />
          ) : (
            <InfoTab
              currentUser={currentUser}
              onLogout={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
