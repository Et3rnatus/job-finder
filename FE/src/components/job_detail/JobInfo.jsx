function JobInfo({ title, content }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h2>

      {/* CONTENT */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
        {content}
      </div>
    </div>
  );
}

export default JobInfo;
