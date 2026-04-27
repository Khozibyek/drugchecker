"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Trash2,
  Search,
  CalendarDays,
  Plus,
  Pencil,
} from "lucide-react";
import AddUserModal from "../_components/AddUserModal";
import EditUserModal from "../_components/EditUserModal";
import UserHistoryModal from "../_components/UserHistoryModal";

type UserItem = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  history_count?: number;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA");
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [historyUser, setHistoryUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Users fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Хэрэглэгчийг устгахдаа итгэлтэй байна уу?")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch {
      console.error("Delete error");
    }
  };

  const filtered = users.filter(
    (i) =>
      i.first_name.toLowerCase().includes(search.toLowerCase()) ||
      i.last_name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  return (
    <div className="p-14">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Хэрэглэгчид</h1>
          <p className="text-sm text-slate-500 mt-1">
            Нийт {users.length} хэрэглэгч
          </p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm flex-1 max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Нэр, имэйлээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Хэрэглэгч нэмэх
        </button>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onAdd={(user) => setUsers([user, ...users])}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdate={(updated) => {
            setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
            setEditUser(null);
          }}
        />
      )}

      {historyUser && (
        <UserHistoryModal
          userId={historyUser.id}
          email={`${historyUser.email}`}
          onClose={() => setHistoryUser(null)}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                #
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Овог
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Нэр
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Имэйл
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Бүртгүүлсэн
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">
                Шалгасан түүх
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-slate-400"
                >
                  Хэрэглэгч олдсонгүй
                </td>
              </tr>
            ) : (
              filtered.map((u, index) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-sm text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-800">
                      {u.first_name}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-800">
                      {u.last_name}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500">
                    {u.email}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(u.created_at)}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      onClick={() => setHistoryUser(u)}
                      className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-600 cursor-pointer hover:bg-blue-100 transition"
                    >
                      {u.history_count}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditUser(u)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
