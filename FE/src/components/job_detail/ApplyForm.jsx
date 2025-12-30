import { useState } from 'react';
import { applyJob } from '../../services/applicationService';

function ApplyForm({ jobId, jobTitle }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await applyJob({
        job_id: jobId,
        cover_letter: coverLetter
      });

      alert('Ứng tuyển thành công');
      setCoverLetter('');
    } catch (err) {
      alert(err.response?.data?.message || 'Ứng tuyển thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ứng tuyển vị trí: {jobTitle}
      </h2>

      {/* Chọn CV (UI giữ lại – chưa xử lý) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn CV để ứng tuyển
        </label>
        <select
          disabled
          className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
        >
          <option>CV Online</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Ứng viên sử dụng hồ sơ trực tuyến trên hệ thống
        </p>
      </div>

      {/* Thư giới thiệu */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thư giới thiệu
        </label>
        <textarea
          rows="5"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Giới thiệu ngắn gọn bản thân và lý do bạn muốn ứng tuyển vào vị trí này."
        />
        <p className="text-sm text-gray-500 mt-1">
          Viết gì đó để nhà tuyển dụng hiểu thêm về bạn nhé!
        </p>
      </div>

      {/* Nút nộp hồ sơ */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Đang gửi...' : 'Nộp hồ sơ ứng tuyển'}
      </button>
    </form>
  );
}

export default ApplyForm;
