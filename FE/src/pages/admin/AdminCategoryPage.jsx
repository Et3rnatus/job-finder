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
} from "lucide-react";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    setCategories(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createCategory(name.trim());
    setName("");
    loadCategories();
  };

  const handleToggle = async (id) => {
    await toggleCategory(id);
    loadCategories();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
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

      {/* CREATE */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên category mới..."
          className="flex-1 min-w-[240px] border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          Thêm mới
        </button>
      </div>

      {/* LIST */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        {loading && (
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Chưa có category nào
          </div>
        )}

        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {c.is_active ? (
                <CheckCircle2
                  size={18}
                  className="text-green-600"
                />
              ) : (
                <XCircle
                  size={18}
                  className="text-gray-400"
                />
              )}
              <span className="font-medium text-gray-800">
                {c.name}
              </span>
            </div>

            <button
              onClick={() => handleToggle(c.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  c.is_active
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }
              `}
            >
              <Power size={14} />
              {c.is_active ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
