import { useNavigate } from "react-router-dom";

function JobCard({ id, title, salary, location, company, skill }) {
  const navigate = useNavigate();

  const handleApply = (e) => {
    e.stopPropagation();
    alert("Ứng tuyển thành công (demo)");
  };

  return (
    <div
      onClick={() => navigate(`/jobs/${id}`)}
      className="
        bg-white
        border border-gray-200
        rounded-lg
        px-5 py-4
        flex items-center justify-between
        hover:border-green-500
        hover:shadow-sm
        hover:-translate-y-[1px]
        transition
        cursor-pointer
      "
    >
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        {/* COMPANY */}
        <p className="text-xs text-gray-500 truncate">
          {company}
        </p>

        {/* TITLE */}
        <h3 className="text-sm font-semibold text-gray-800 mt-1 truncate">
          {title}
        </h3>

        {/* META */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
          <span>💰 {salary}</span>
          <span>📍 {location}</span>
        </div>

        {/* SKILL */}
        {skill && (
          <div className="mt-2 flex gap-1 flex-wrap">
            {skill
              .split(",")
              .slice(0, 3)
              .map((s, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {s.trim()}
                </span>
              ))}
            {skill.split(",").length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{skill.split(",").length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={handleApply}
          className="
            text-xs
            px-3 py-1.5
            border border-green-600
            text-green-600
            rounded
            hover:bg-green-600
            hover:text-white
            transition
          "
        >
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

export default JobCard;
