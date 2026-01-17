import {
  Briefcase,
  GraduationCap,
  Users,
  Clock,
  Info,
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
    <section className="bg-white border rounded-3xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Info className="text-emerald-600" size={18} />
          <h3 className="text-lg font-semibold text-gray-800">
            Thông tin chung
          </h3>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
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
        group
        flex items-start gap-4
        p-4 rounded-2xl
        border border-gray-100
        bg-gray-50
        hover:bg-white hover:border-emerald-200
        hover:shadow-sm
        transition
      "
    >
      {/* ICON */}
      <div
        className="
          w-11 h-11 flex items-center justify-center
          rounded-xl
          bg-emerald-100 text-emerald-600
          shrink-0
          transition
          group-hover:scale-105
        "
      >
        <Icon size={18} />
      </div>

      {/* CONTENT */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

export default JobGeneralInfo;
