import { useState } from "react";

function CreateJobForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    location: "",
    min_salary: "",
    max_salary: "",
    job_skill: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đăng tin tuyển dụng thành công (demo)");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Đăng tin tuyển dụng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ===== THÔNG TIN CHUNG ===== */}
        <section>
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Thông tin công việc
          </h3>

          <input
            name="title"
            placeholder="Tên công việc"
            onChange={handleChange}
            className="w-full border p-3 rounded mb-3"
          />

          <input
            name="location"
            placeholder="Địa điểm làm việc"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </section>

        {/* ===== MÔ TẢ & YÊU CẦU ===== */}
        <section>
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Mô tả & yêu cầu
          </h3>

          <textarea
            name="description"
            placeholder="Mô tả công việc"
            onChange={handleChange}
            className="w-full border p-3 rounded mb-3"
          />

          <textarea
            name="requirements"
            placeholder="Yêu cầu ứng viên"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </section>

        {/* ===== KỸ NĂNG ===== */}
        <section>
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Kỹ năng yêu cầu
          </h3>

          <input
            name="job_skill"
            placeholder="VD: ReactJS, NodeJS, MySQL"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nhập các kỹ năng, cách nhau bằng dấu phẩy
          </p>
        </section>

        {/* ===== QUYỀN LỢI ===== */}
        <section>
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Quyền lợi
          </h3>

          <textarea
            name="benefits"
            placeholder="Quyền lợi dành cho ứng viên"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </section>

        {/* ===== LƯƠNG ===== */}
        <section>
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Mức lương
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="min_salary"
              placeholder="Lương tối thiểu"
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
            <input
              name="max_salary"
              placeholder="Lương tối đa"
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />
          </div>
        </section>

        {/* ===== SUBMIT ===== */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium"
        >
          Đăng tin tuyển dụng
        </button>
      </form>
    </div>
  );
}

export default CreateJobForm;
