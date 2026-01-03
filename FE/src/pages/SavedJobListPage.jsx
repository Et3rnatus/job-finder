import SavedJobList from "../components/candidate/SavedJobList";

function SavedJobListPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* =====================
            PAGE HEADER
        ===================== */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Việc làm đã lưu
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Lưu lại những công việc bạn quan tâm để theo dõi, so sánh
            và ứng tuyển vào thời điểm phù hợp.
          </p>
        </div>

        {/* =====================
            CONTENT CARD
        ===================== */}
        <div className="bg-white border rounded-xl p-6">
          <SavedJobList />
        </div>
      </div>
    </div>
  );
}

export default SavedJobListPage;
