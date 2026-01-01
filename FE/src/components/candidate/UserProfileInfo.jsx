function UserProfileInfo({ profile }) {
  if (!profile) {
    return null;
  }

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
  } = profile;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* HEADER */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Hồ sơ cá nhân
      </h2>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">

        {/* LEFT */}
        <div className="space-y-4">
          <Info label="Họ và tên" value={full_name} />
          <Info label="Số điện thoại" value={contact_number} />
          <Info label="Địa chỉ" value={address} />
          <Info label="Giới tính" value={gender} />
          <Info label="Ngày sinh" value={date_of_birth} />
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Info
            label="Kỹ năng"
            value={
              skills && skills.length > 0
                ? skills.map((s) => s.name).join(", ")
                : "Chưa cập nhật"
            }
          />

          <Info
            label="Giới thiệu"
            value={bio || "Chưa cập nhật"}
          />
        </div>
      </div>

      {/* EDUCATION */}
      <Section title="Học vấn">
        {education && education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="text-sm text-gray-700 mb-2">
              <p className="font-medium">{edu.school}</p>
              <p>
                {edu.degree} {edu.major && `- ${edu.major}`}
              </p>
            </div>
          ))
        ) : (
          <EmptyText />
        )}
      </Section>

      {/* EXPERIENCE */}
      <Section title="Kinh nghiệm làm việc">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp, index) => (
            <div key={index} className="text-sm text-gray-700 mb-3">
              <p className="font-medium">
                {exp.position} – {exp.company}
              </p>
              {exp.description && (
                <p className="text-gray-600">
                  {exp.description}
                </p>
              )}
            </div>
          ))
        ) : (
          <EmptyText />
        )}
      </Section>
    </div>
  );
}

/* ===== HELPER COMPONENTS ===== */

function Info({ label, value }) {
  return (
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      <p>{value || "Chưa cập nhật"}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <h3 className="font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function EmptyText() {
  return (
    <p className="text-sm text-gray-400">
      Chưa cập nhật
    </p>
  );
}

export default UserProfileInfo;
