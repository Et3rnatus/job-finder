import { useState } from "react";
import { createJob } from "../../services/jobService";

function CreateJobForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    min_salary: "",
    max_salary: "",
    employment_type: "Full-time"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob(form);
      alert("Đăng tuyển thành công");
      setForm({
        title: "",
        description: "",
        location: "",
        min_salary: "",
        max_salary: "",
        employment_type: "Full-time"
      });
    } catch (err){
      console.err(err);
      alert("Đăng tuyển thất bại");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Đăng tuyển việc làm</h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tiêu đề công việc"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả công việc"
          className="w-full border p-2 rounded"
          rows="4"
          required
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Địa điểm làm việc"
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="min_salary"
            value={form.min_salary}
            onChange={handleChange}
            placeholder="Lương tối thiểu"
            className="w-full border p-2 rounded"
          />
          <input
            name="max_salary"
            value={form.max_salary}
            onChange={handleChange}
            placeholder="Lương tối đa"
            className="w-full border p-2 rounded"
          />
        </div>

        <select
          name="employment_type"
          value={form.employment_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Intern</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Đăng tuyển
        </button>

      </form>
    </div>
  );
}

export default CreateJobForm;
