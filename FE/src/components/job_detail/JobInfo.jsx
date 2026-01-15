function JobInfo({ title, content }) {
  const isArray = Array.isArray(content);

  const isEmpty =
    !content ||
    (isArray && content.length === 0) ||
    (!isArray &&
      typeof content === "string" &&
      content.trim() === "");

  return (
    <section
      className="
        bg-white border border-gray-200
        rounded-2xl p-6 md:p-7
        shadow-sm
      "
    >
      {/* =====================
          SECTION HEADER
      ===================== */}
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1.5 h-7 bg-green-600 rounded-full" />
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

        {/* ARRAY CONTENT (LIST) */}
        {!isEmpty && isArray && (
          <ul className="space-y-3">
            {content.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
              >
                {/* BULLET */}
                <span className="mt-2 w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />

                {/* TEXT */}
                <span className="leading-relaxed">
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
          <p className="whitespace-pre-line leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}

export default JobInfo;
