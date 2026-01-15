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

  const items = [
    job.level && {
      icon: Briefcase,
      label: "Cấp bậc",
      value: levelMap[job.level] || job.level,
    },
    job.education_level && {
      icon: GraduationCap,
      label: "Học vấn",
      value:
        educationMap[job.education_level] ||
        job.education_level,
    },
    job.hiring_quantity != null && {
      icon: Users,
      label: "Số lượng tuyển",
      value:
        job.hiring_quantity === 1
          ? "1 người"
          : `${job.hiring_quantity} người`,
    },
    job.employment_type && {
      icon: Clock,
      label: "Hình thức làm việc",
      value:
        employmentTypeMap[job.employment_type] ||
        job.employment_type,
    },
  ].filter(Boolean);

  return (
    <section className="bg-white border rounded-2xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Thông tin chung
        </h3>
        <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600 font-medium">
          Tổng quan
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <InfoCard
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  );
}

/* =====================
   SUB COMPONENT
===================== */

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div
      className="
        flex items-start gap-4
        p-4 rounded-xl
        border border-gray-100
        bg-gray-50
        hover:bg-white hover:border-green-200
        hover:shadow-sm
        transition
      "
    >
      {/* ICON */}
      <div
        className="
          w-10 h-10 flex items-center justify-center
          rounded-lg
          bg-green-100 text-green-600
          shrink-0
        "
      >
        <Icon size={18} />
      </div>

      {/* CONTENT */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default JobGeneralInfo;
