function UserProfileInfo({ profile }) {
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
    ? new Date(date_of_birth).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";

  return (
    <div className="bg-white border rounded-xl p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Hồ sơ cá nhân
        </h2>

        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
          CV Online
        </span>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <InfoGroup title="Thông tin cá nhân">
          <Info label="Họ và tên" value={full_name} />
          <Info label="Giới tính" value={gender} />
          <Info label="Ngày sinh" value={formattedDob} />
          <Info label="Địa chỉ" value={address} />
        </InfoGroup>

        <InfoGroup title="Thông tin liên hệ">
          <Info label="Email" value={email} />
          <Info label="Số điện thoại" value={contact_number} />
        </InfoGroup>
      </div>

      {/* SKILLS */}
      <Section title="Kỹ năng">
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.id}
                className="
                  px-3 py-1 text-sm rounded-full
                  bg-green-100 text-green-700
                "
              >
                {s.name}
              </span>
            ))}
          </div>
        ) : (
          <EmptyText />
        )}
      </Section>

      {/* BIO */}
      <Section title="Giới thiệu bản thân">
        {bio ? (
          <p className="text-gray-700 leading-relaxed">
            {bio}
          </p>
        ) : (
          <EmptyText />
        )}
      </Section>

      {/* EDUCATION */}
      <Section title="Học vấn">
        {education && education.length > 0 ? (
          <div className="space-y-4">
            {education.map((edu, index) => (
              <TimelineItem
                key={index}
                title={edu.school}
                subtitle={`${edu.degree}${edu.major ? ` – ${edu.major}` : ""}`}
              />
            ))}
          </div>
        ) : (
          <EmptyText />
        )}
      </Section>

      {/* EXPERIENCE */}
      <Section title="Kinh nghiệm làm việc">
        {experiences && experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <TimelineItem
                key={index}
                title={`${exp.position} – ${exp.company}`}
                description={exp.description}
              />
            ))}
          </div>
        ) : (
          <EmptyText />
        )}
      </Section>
    </div>
  );
}

/* =====================
   SUB COMPONENTS
===================== */

function InfoGroup({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TimelineItem({ title, subtitle, description }) {
  return (
    <div className="relative pl-6">
      <span className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500" />
      <div>
        <p className="font-medium text-gray-800">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyText() {
  return (
    <p className="text-sm text-gray-400 italic">
      Chưa cập nhật
    </p>
  );
}

export default UserProfileInfo;
