import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  toggleCategory,
} from "../../services/adminService";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await createCategory(name);
    setName("");
    loadCategories();
  };

  const handleToggle = async (id) => {
    await toggleCategory(id);
    loadCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Job Categories
      </h1>

      {/* CREATE */}
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="border px-4 py-2 rounded w-64"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white border rounded">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center p-4 border-b"
          >
            <span>{c.name}</span>
            <button
              onClick={() => handleToggle(c.id)}
              className={`text-sm ${
                c.is_active
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {c.is_active ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
