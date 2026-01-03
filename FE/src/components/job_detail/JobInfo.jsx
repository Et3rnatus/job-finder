function JobInfo({ title, content }) {
  const isArray = Array.isArray(content);
  const isEmpty = !content || (isArray && content.length === 0);

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* ===== SECTION TITLE ===== */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-green-600 rounded-full" />
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="text-gray-700 leading-relaxed text-sm">
        {/* EMPTY */}
        {isEmpty && (
          <div className="flex items-center gap-2 text-gray-400 italic">
            <span>—</span>
            <span>Chưa cập nhật</span>
          </div>
        )}

        {/* ARRAY */}
        {!isEmpty && isArray && (
          <ul className="space-y-2 pl-1">
            {content.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* TEXT */}
        {!isEmpty && !isArray && (
          <p className="whitespace-pre-line">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}

export default JobInfo;
