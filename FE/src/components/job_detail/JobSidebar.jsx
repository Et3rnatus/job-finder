function JobSidebar({ company }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* COMPANY HEADER */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={company.logo}
          alt="logo"
          className="w-12 h-12 object-contain border rounded"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {company.name}
          </h3>
          <p className="text-sm text-gray-600">
            Quy mô: {company.size}
          </p>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="text-sm text-gray-700 space-y-2">
        <p>
          <strong>Website:</strong>{" "}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            {company.website}
          </a>
        </p>

        <p>
          <strong>Địa chỉ:</strong> {company.address}
        </p>
      </div>
    </div>
  );
}

export default JobSidebar;
