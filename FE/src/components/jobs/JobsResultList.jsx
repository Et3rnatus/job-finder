import JobList from "../home/JobList";

function JobsResultList({ jobs = [], loading }) {
  return (
    <section className="space-y-6">
      <div
        className="
          relative
          bg-white
          border border-gray-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* ACCENT BAR */}
        <span
          className="
            absolute left-0 top-0 bottom-0
            w-1 bg-green-600
          "
        />

        {/* CONTENT */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Đang tải dữ liệu...
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Không tìm thấy công việc phù hợp
            </div>
          ) : (
            <JobList jobs={jobs} />
          )}
        </div>
      </div>
    </section>
  );
}

export default JobsResultList;
