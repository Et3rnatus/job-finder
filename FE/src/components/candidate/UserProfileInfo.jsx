import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Sparkles,
} from "lucide-react";

export default function UserProfileInfo({ profile }) {
  if (!profile) return null;

  const {
    full_name,
    contact_number,
    address,
    bio,
    gender,
    date_of_birth,
    skills,
    education,
    experiences,
    email,
  } = profile;

  const formattedDob = date_of_birth
    ? new Date(date_of_birth).toLocaleDateString(
        "vi-VN"
      )
    : "Chưa cập nhật";

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Hồ sơ cá nhân
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            CV Online của ứng viên
          </p>
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <Sparkles size={14} />
          CV Online
        </span>
      </div>

      {/* =====================
          BASIC INFO
      ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <InfoCard title="Thông tin cá nhân">
          <InfoRow
            icon={<User size={15} />}
            label="Họ và tên"
            value={full_name}
          />
          <InfoRow
            icon={<Calendar size={15} />}
            label="Ngày sinh"
            value={formattedDob}
          />
          <InfoRow
            icon={<User size={15} />}
            label="Giới tính"
            value={gender}
          />
          <InfoRow
            icon={<MapPin size={15} />}
            label="Địa chỉ"
            value={address}
          />
        </InfoCard>

        <InfoCard title="Thông tin liên hệ">
          <InfoRow
            icon={<Mail size={15} />}
            label="Email"
            value={email}
          />
          <InfoRow
            icon={<Phone size={15} />}
            label="Số điện thoại"
            value={contact_number}
          />
        </InfoCard>
      </div>

      {/* =====================
          SKILLS
      ===================== */}
      <Section title="Kỹ năng">
        {skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
              >
                {s.name}
              </span>
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </Section>

      {/* =====================
          BIO
      ===================== */}
      <Section title="Giới thiệu bản thân">
        {bio ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line max-w-3xl">
            {bio}
          </p>
        ) : (
          <Empty />
        )}
      </Section>

      {/* =====================
          EDUCATION
      ===================== */}
      <Section title="Học vấn">
        {education?.length ? (
          <div className="space-y-5">
            {education.map((edu, index) => (
              <Timeline
                key={index}
                icon={<GraduationCap size={14} />}
                title={edu.school}
                subtitle={`${edu.degree || ""}${
                  edu.major ? ` – ${edu.major}` : ""
                }`}
              />
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </Section>

      {/* =====================
          EXPERIENCE
      ===================== */}
      <Section title="Kinh nghiệm làm việc">
        {experiences?.length ? (
          <div className="space-y-5">
            {experiences.map((exp, index) => (
              <Timeline
                key={index}
                icon={<Briefcase size={14} />}
                title={`${exp.position || ""}${
                  exp.company
                    ? ` – ${exp.company}`
                    : ""
                }`}
                description={exp.description}
              />
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </Section>
    </div>
  );
}

/* =====================
   SUB COMPONENTS
===================== */

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {value || "Chưa cập nhật"}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-14">
      <h3 className="text-xl font-semibold text-gray-900 mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Timeline({
  title,
  subtitle,
  description,
  icon,
}) {
  return (
    <div className="relative pl-10">
      <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
        {icon}
      </span>

      <div>
        <p className="font-medium text-gray-900">
          {title || "—"}
        </p>

        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-sm text-gray-600 mt-1 max-w-3xl whitespace-pre-line">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <p className="text-sm text-gray-400 italic">
      Chưa cập nhật
    </p>
  );
}
