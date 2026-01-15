import JobList from "../home/JobList";

function JobResultList() {
  return (
    <section
      className="
        space-y-6
      "
    >
      {/* =====================
          RESULT CONTAINER
      ===================== */}
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
          <JobList />
        </div>
      </div>
    </section>
  );
}

export default JobResultList;
