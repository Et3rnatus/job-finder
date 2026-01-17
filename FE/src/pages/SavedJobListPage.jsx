import { Bookmark } from "lucide-react";
import SavedJobList from "../components/candidate/SavedJobList";

function SavedJobListPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* =====================
            HEADER
        ===================== */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <Bookmark size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Việc làm đã lưu
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Danh sách các công việc bạn đã lưu để theo dõi,
              so sánh và ứng tuyển vào thời điểm phù hợp.
            </p>
          </div>
        </div>

        {/* =====================
            CONTENT
        ===================== */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <SavedJobList />
        </div>
      </div>
    </div>
  );
}

export default SavedJobListPage;
