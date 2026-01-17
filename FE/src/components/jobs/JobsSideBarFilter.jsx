import { SlidersHorizontal, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

function JobFilterSidebarFilter({ onChange }) {
  const [categoryIds, setCategoryIds] = useState([]);
  const [skillIds, setSkillIds] = useState([]);

  /* =====================
     EMIT FILTER
  ===================== */
  useEffect(() => {
    onChange?.({
      categoryIds,
      skillIds,
    });
  }, [categoryIds, skillIds]);

  const toggle = (id, list, setList) => {
    setList((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const clearAll = () => {
    setCategoryIds([]);
    setSkillIds([]);
  };

  const hasFilter =
    categoryIds.length > 0 || skillIds.length > 0;

  return (
    <aside className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden sticky top-6">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center justify-between gap-3 px-6 py-5 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Lọc nâng cao
            </h3>
            <p className="text-xs text-gray-500">
              Tùy chỉnh kết quả tìm kiếm
            </p>
          </div>
        </div>

        {hasFilter && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1"
          >
            <X size={14} />
            Xóa lọc
          </button>
        )}
      </div>

      {/* =====================
          CONTENT
      ===================== */}
      <div className="px-6 py-6 space-y-8 text-sm text-gray-700">
        {/* CATEGORY */}
        <FilterGroup title="Ngành nghề">
          <FilterItem
            label="IT / Phần mềm"
            checked={categoryIds.includes(1)}
            onChange={() => toggle(1, categoryIds, setCategoryIds)}
          />
          <FilterItem
            label="Backend Developer"
            checked={categoryIds.includes(2)}
            onChange={() => toggle(2, categoryIds, setCategoryIds)}
          />
          <FilterItem
            label="Frontend Developer"
            checked={categoryIds.includes(3)}
            onChange={() => toggle(3, categoryIds, setCategoryIds)}
          />
        </FilterGroup>

        {/* SKILL */}
        <FilterGroup title="Kỹ năng">
          <FilterItem
            label="JavaScript"
            checked={skillIds.includes(1)}
            onChange={() => toggle(1, skillIds, setSkillIds)}
          />
          <FilterItem
            label="ReactJS"
            checked={skillIds.includes(2)}
            onChange={() => toggle(2, skillIds, setSkillIds)}
          />
          <FilterItem
            label="NodeJS"
            checked={skillIds.includes(3)}
            onChange={() => toggle(3, skillIds, setSkillIds)}
          />
        </FilterGroup>
      </div>

      {/* =====================
          FOOTER
      ===================== */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <Info className="w-4 h-4 mt-0.5" />
          <p className="italic">
            Chức năng lọc minh họa nghiệp vụ cho luận văn.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* =====================
   SUB COMPONENTS
===================== */

function FilterGroup({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-4">
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FilterItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-emerald-600"
      />
      <span className="group-hover:text-emerald-600 transition">
        {label}
      </span>
    </label>
  );
}

export default JobFilterSidebarFilter;
