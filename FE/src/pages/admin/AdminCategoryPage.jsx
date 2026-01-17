import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  toggleCategory,
} from "../../services/adminService";
import {
  Layers,
  Plus,
  Power,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  /* =====================
     LOAD
  ===================== */
  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* =====================
     CREATE
  ===================== */
  const handleCreate = async () => {
    if (!name.trim() || creating) return;

    try {
      setCreating(true);
      await createCategory(name.trim());
      setName("");
      loadCategories();
    } finally {
      setCreating(false);
    }
  };

  /* =====================
     TOGGLE
  ===================== */
  const handleToggle = async (c) => {
    const ok = window.confirm(
      c.is_active
        ? `Tắt category "${c.name}"?`
        : `Bật category "${c.name}"?`
    );
    if (!ok) return;

    try {
      setTogglingId(c.id);
      await toggleCategory(c.id);
      loadCategories();
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Categories
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý danh mục ngành nghề
          </p>
        </div>
      </div>

      {/* =====================
          CREATE
      ===================== */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên category mới..."
          className="
            flex-1 min-w-[240px]
            border border-gray-300 rounded-2xl
            px-4 py-3 text-sm
            focus:outline-none
            focus:ring-2 focus:ring-emerald-500
          "
        />

        <button
          onClick={handleCreate}
          disabled={!name.trim() || creating}
          className={`
            inline-flex items-center gap-2
            px-6 py-3 rounded-2xl
            font-semibold text-sm
            transition
            ${
              !name.trim() || creating
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }
          `}
        >
          {creating ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Plus size={16} />
          )}
          Thêm mới
        </button>
      </div>

      {/* =====================
          LIST
      ===================== */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        {/* LOADING */}
        {loading && (
          <div className="py-14 flex flex-col items-center gap-3 text-gray-500">
            <Loader2
              className="animate-spin text-emerald-600"
              size={24}
            />
            <span className="text-sm">
              Đang tải danh mục...
            </span>
          </div>
        )}

        {/* EMPTY */}
        {!loading && categories.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Chưa có category nào
          </div>
        )}

        {/* ITEMS */}
        {!loading &&
          categories.map((c) => (
            <div
              key={c.id}
              className="
                flex items-center justify-between
                px-6 py-4
                border-b last:border-b-0
                hover:bg-gray-50 transition
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                {c.is_active ? (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600 shrink-0"
                  />
                ) : (
                  <XCircle
                    size={18}
                    className="text-gray-400 shrink-0"
                  />
                )}

                <span className="font-medium text-gray-800 truncate">
                  {c.name}
                </span>
              </div>

              <button
                onClick={() => handleToggle(c)}
                disabled={togglingId === c.id}
                className={`
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  text-sm font-semibold
                  transition
                  ${
                    c.is_active
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }
                  disabled:opacity-50
                `}
              >
                {togglingId === c.id ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Power size={14} />
                )}
                {c.is_active ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
