function JobFilterSidebar() {
  return (
    <aside className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* ===== TITLE ===== */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Lọc nâng cao
      </h3>

      {/* ===== FILTER GROUP ===== */}
      <div className="space-y-3 text-sm text-gray-700">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="accent-green-600"
          />
          <span>IT / Phần mềm</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="accent-green-600"
          />
          <span>Backend</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="accent-green-600"
          />
          <span>Frontend</span>
        </label>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="border-t my-4" />

      {/* ===== NOTE ===== */}
      <p className="text-xs text-gray-400 italic">
        * Demo giao diện, chức năng lọc sẽ được phát triển
        trong giai đoạn tiếp theo
      </p>
    </aside>
  );
}

export default JobFilterSidebar;
