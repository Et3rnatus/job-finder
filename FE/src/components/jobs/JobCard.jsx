import { useNavigate } from "react-router-dom";

function JobCard({ id, title, salary, location, company, skills }) {
  const navigate = useNavigate();

  const handleApply = (e) => {
  e.stopPropagation();
  navigate(`/jobs/${id}`);
};

  const skillList = skills ? skills.split(",") : [];

  return (
    <div
      onClick={() => navigate(`/jobs/${id}`)}
      className="
        bg-white border border-gray-200 rounded-xl
        p-5 flex gap-4
        hover:border-green-500 hover:shadow-md
        transition cursor-pointer
      "
    >
  
      <div className="flex-1 min-w-0">
  
        <p className="text-xs text-gray-500 truncate">
          {company}
        </p>

      
        <h3 className="text-base font-semibold text-gray-800 mt-1 truncate">
          {title}
        </h3>

        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            💰 {salary}
          </span>
          <span className="flex items-center gap-1">
            📍 {location}
          </span>
        </div>


        {skillList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skillList.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="
                  text-xs bg-green-50 text-green-700
                  px-2 py-1 rounded-full
                "
              >
                {skill.trim()}
              </span>
            ))}

            {skillList.length > 3 && (
              <span className="text-xs text-gray-400">
                +{skillList.length - 3} kỹ năng
              </span>
            )}
          </div>
        )}
      </div>


      <div className="flex items-center">
        <button
          onClick={handleApply}
          className="
            text-sm px-4 py-2
            border border-green-600 text-green-600
            rounded-full
            hover:bg-green-600 hover:text-white
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
