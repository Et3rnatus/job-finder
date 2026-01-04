import {
  Briefcase,
  GraduationCap,
  Users,
  Clock,
} from "lucide-react";

const levelMap = {
  intern: "Thực tập sinh",
  staff: "Nhân viên",
  senior: "Senior",
  leader: "Trưởng nhóm",
  manager: "Quản lý",
};

const educationMap = {
  high_school: "THPT",
  college: "Cao đẳng",
  university: "Đại học trở lên",
  master: "Thạc sĩ",
  phd: "Tiến sĩ",
};

const employmentTypeMap = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  intern: "Thực tập",
};

function JobGeneralInfo({ job }) {
  if (!job) return null;

  const hasLevel = Boolean(job.level);
  const hasEducation = Boolean(job.education_level);
  const hasQuantity = job.hiring_quantity != null;
  const hasEmploymentType = Boolean(job.employment_type);

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        Thông tin chung
      </h3>

      <div className="space-y-3 text-sm text-gray-700">
        {/* LEVEL */}
        {hasLevel && (
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-gray-500">Cấp bậc</p>
              <p className="font-medium">
                {levelMap[job.level] || job.level}
              </p>
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {hasEducation && (
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-gray-500">Học vấn</p>
              <p className="font-medium">
                {educationMap[job.education_level] ||
                  job.education_level}
              </p>
            </div>
          </div>
        )}

        {/* QUANTITY */}
        {hasQuantity && (
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-gray-500">Số lượng tuyển</p>
              <p className="font-medium">
                {job.hiring_quantity === 1
                  ? "1 người"
                  : `${job.hiring_quantity} người`}
              </p>
            </div>
          </div>
        )}

        {/* EMPLOYMENT TYPE */}
        {hasEmploymentType && (
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-gray-500">
                Hình thức làm việc
              </p>
              <p className="font-medium">
                {employmentTypeMap[job.employment_type] ||
                  job.employment_type}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobGeneralInfo;
