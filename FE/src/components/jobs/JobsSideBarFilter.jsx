function JobFilterSidebar() {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-3">Lọc nâng cao</h3>

      <div className="space-y-2 text-sm text-gray-600">
        <label className="block">
          <input type="checkbox" /> IT / Phần mềm
        </label>
        <label className="block">
          <input type="checkbox" /> Backend
        </label>
        <label className="block">
          <input type="checkbox" /> Frontend
        </label>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        * Demo UI, chưa áp dụng filter
      </p>
    </div>
  );
}

export default JobFilterSidebar;
