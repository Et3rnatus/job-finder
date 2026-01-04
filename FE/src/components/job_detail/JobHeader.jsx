import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase
} from "lucide-react";

function JobHeader({ job }) {
  /* =====================
     FORMATTERS
  ===================== */
  const formatSalary = () => {
    if (job.is_salary_negotiable) return "Thỏa thuận";
    if (job.min_salary && job.max_salary) {
      return `${job.min_salary} - ${job.max_salary} triệu`;
    }
    return "Thỏa thuận";
  };

  const formatDeadline = () => {
    if (!job.expired_at) return null;
    return new Date(job.expired_at).toLocaleDateString("vi-VN");
  };

  const formatPostedDate = () => {
    if (!job.created_at) return null;

    const days = Math.floor(
      (Date.now() - new Date(job.created_at)) /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return "Hôm nay";
    return `${days} ngày trước`;
  };

  const experienceLabelMap = {
    no_experience: "Không yêu cầu",
    under_1_year: "Dưới 1 năm",
    "1_year": "1 năm",
    "2_3_years": "2–3 năm",
    "3_5_years": "3–5 năm",
    over_5_years: "Trên 5 năm",
  };

  /* =====================
     LOCATION (CITY ONLY)
  ===================== */
  const getCityFromLocation = () => {
    if (!job.location) return null;
    // location dạng: "Số nhà, Quận/Huyện, Thành phố"
    const parts = job.location.split(",");
    return parts[parts.length - 1].trim();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* =====================
          JOB TITLE
      ===================== */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
          {job.title}
        </h1>

        {/* POSTED DATE */}
        {job.created_at && (
          <p className="text-xs text-gray-500 mt-1">
            Đăng {formatPostedDate()}
          </p>
        )}
      </div>

      {/* =====================
          META INFO
      ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
        {/* SALARY */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-medium">Mức lương:</span>{" "}
            {formatSalary()}
          </span>
        </div>

        {/* LOCATION – CITY ONLY */}
        {job.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>
              <span className="font-medium">Địa điểm:</span>{" "}
              {getCityFromLocation()}
            </span>
          </div>
        )}

        {/* EXPERIENCE */}
        {job.experience && experienceLabelMap[job.experience] && (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-green-600" />
            <span>
              <span className="font-medium">Kinh nghiệm:</span>{" "}
              {experienceLabelMap[job.experience]}
            </span>
          </div>
        )}

        {/* DEADLINE */}
        {job.expired_at && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span>
              <span className="font-medium">Hạn nộp hồ sơ:</span>{" "}
              {formatDeadline()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobHeader;
