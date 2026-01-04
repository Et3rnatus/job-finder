import { useState } from "react";

export default function RejectJobModal({ onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!note.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }

    onSubmit(note);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded shadow w-full max-w-md p-6">
        {/* ===== TITLE ===== */}
        <h2 className="text-lg font-semibold mb-4">
          Từ chối công việc
        </h2>

        {/* ===== NOTE INPUT ===== */}
        <textarea
          className="w-full border rounded p-3 text-sm focus:outline-none focus:ring"
          rows={4}
          placeholder="Nhập lý do từ chối (bắt buộc)"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setError("");
          }}
        />

        {error && (
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}

        {/* ===== ACTION ===== */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded text-sm"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-red-600 text-white rounded text-sm"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
