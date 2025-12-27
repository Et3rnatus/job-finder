
function JobInfo({ title, content }) {
  return (
    <div className="bg-white p-6 shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}
export default JobInfo;
