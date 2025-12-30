import { useEffect, useState } from "react";
import employerService from "../../services/employerService";

function EmployerProfileForm() {
  const [form, setForm] = useState({
    company_name: "",
    website: "",
    address: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    employerService
      .getProfile()
      .then((data) => {
        setForm({
          company_name: data.company_name || "",
          website: data.website || "",
          address: data.address || "",
          description: data.description || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert("Không tải được hồ sơ công ty");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employerService.updateProfile(form);
      alert("Cập nhật hồ sơ công ty thành công");

      onProfileCompleted && onProfileCompleted();

    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Hồ sơ công ty
      </h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            Thông tin doanh nghiệp
          </h4>

          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Tên công ty"
            className="w-full border p-3 rounded mb-3"
            required
          />

          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website công ty"
            className="w-full border p-3 rounded mb-3"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ công ty"
            className="w-full border p-3 rounded"
          />
        </section>

        <section>
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            Giới thiệu công ty
          </h4>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả ngắn gọn về công ty"
            rows="5"
            className="w-full border p-3 rounded"
          />
        </section>

        <div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
          >
            Lưu hồ sơ
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployerProfileForm;
