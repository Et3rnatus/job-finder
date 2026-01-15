import { SlidersHorizontal, Info } from "lucide-react";

function JobFilterSidebar() {
  return (
    <aside
      className="
        bg-white border border-gray-200
        rounded-2xl shadow-sm
        overflow-hidden
      "
    >
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center gap-3 px-6 py-5 border-b">
        <div
          className="
            w-10 h-10 rounded-xl
            bg-green-100 text-green-600
            flex items-center justify-center
          "
        >
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

      {/* =====================
          FILTER CONTENT
      ===================== */}
      <div className="px-6 py-5 space-y-6 text-sm text-gray-700">
        {/* ===== CATEGORY ===== */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Ngành nghề
          </h4>

          <div className="space-y-3">
            <FilterItem label="IT / Phần mềm" />
            <FilterItem label="Backend Developer" />
            <FilterItem label="Frontend Developer" />
          </div>
        </div>

        {/* ===== SKILL ===== */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Kỹ năng
          </h4>

          <div className="space-y-3">
            <FilterItem label="JavaScript" />
            <FilterItem label="ReactJS" />
            <FilterItem label="NodeJS" />
          </div>
        </div>
      </div>

      {/* =====================
          FOOTER NOTE
      ===================== */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <Info className="w-4 h-4 mt-0.5" />
          <p className="italic leading-relaxed">
            Demo giao diện cho luận văn. Chức năng lọc dữ liệu
            sẽ được phát triển trong giai đoạn tiếp theo.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* =====================
   SUB COMPONENT
===================== */
function FilterItem({ label }) {
  return (
    <label
      className="
        flex items-center gap-3
        cursor-pointer select-none
        group
      "
    >
      <input
        type="checkbox"
        className="
          w-4 h-4
          accent-green-600
          cursor-pointer
        "
      />
      <span
        className="
          text-gray-700
          group-hover:text-green-600
          transition
        "
      >
        {label}
      </span>
    </label>
  );
}

export default JobFilterSidebar;
