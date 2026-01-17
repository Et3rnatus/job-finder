import { Info } from "lucide-react";

function JobInfo({ title, content }) {
  const isArray = Array.isArray(content);

  const isEmpty =
    !content ||
    (isArray && content.length === 0) ||
    (!isArray &&
      typeof content === "string" &&
      content.trim() === "");

  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-7 shadow-sm">
      {/* =====================
          SECTION HEADER
      ===================== */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Info size={18} />
        </div>

        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {/* =====================
          CONTENT
      ===================== */}
      <div className="text-gray-700 text-sm leading-relaxed">
        {/* EMPTY STATE */}
        {isEmpty && (
          <div className="flex items-center gap-2 text-gray-400 italic">
            <span className="text-lg">—</span>
            <span>Chưa cập nhật</span>
          </div>
        )}

        {/* ARRAY CONTENT */}
        {!isEmpty && isArray && (
          <ul className="space-y-4">
            {content.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 group"
              >
                {/* BULLET */}
                <span className="mt-2 w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 transition group-hover:scale-125" />

                {/* TEXT */}
                <span className="leading-relaxed text-gray-800">
                  {typeof item === "string"
                    ? item
                    : item?.name || ""}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* TEXT CONTENT */}
        {!isEmpty && !isArray && (
          <p className="whitespace-pre-line leading-relaxed text-gray-800">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}

export default JobInfo;
