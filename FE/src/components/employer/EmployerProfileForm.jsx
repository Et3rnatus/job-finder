import { useEffect, useState } from "react";
import {
  getEmployerProfile,
  updateEmployerProfile
} from "../../services/employerService";

function EmployerProfileForm() {
  const [form, setForm] = useState({
    company_name: "",
    website: "",
    address: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);

  // Load profile
  useEffect(() => {
    getEmployerProfile()
      .then(data => {
        setForm({
          company_name: data.company_name || "",
          website: data.website || "",
          address: data.address || "",
          description: data.description || ""
        });
        setLoading(false);
      })
      .catch(() => {
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
      await updateEmployerProfile(form);
      alert("Cập nhật hồ sơ công ty thành công");
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-bold mb-4">Hồ sơ nhà tuyển dụng</h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          placeholder="Tên công ty"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website công ty"
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ công ty"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả công ty"
          rows="4"
          className="w-full border p-2 rounded"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Lưu hồ sơ
        </button>

      </form>
    </div>
  );
}

export default EmployerProfileForm;
