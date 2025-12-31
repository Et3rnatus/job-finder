function JobInfo({ title, content }) {
  const isArray = Array.isArray(content);
  const isEmpty =
    !content || (isArray && content.length === 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h2>

      {/* CONTENT */}
      <div className="text-gray-700 leading-relaxed text-sm">
        {isEmpty && (
          <p className="italic text-gray-400">
            Chưa cập nhật
          </p>
        )}

        {!isEmpty && isArray && (
          <ul className="list-disc pl-5 space-y-1">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        {!isEmpty && !isArray && (
          <p className="whitespace-pre-line">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

export default JobInfo;
