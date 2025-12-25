
function JobSidebar({ company }) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={company.logo}
          alt="logo"
          className="w-14 h-14 object-cover rounded"
        />
        <div>
          <h3 className="font-bold text-lg">{company.name}</h3>
          <p className="text-sm text-gray-600">{company.size}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-2">
        <strong>Website:</strong> {company.website}
      </p>

      <p className="text-gray-700">
        <strong>Địa chỉ:</strong> {company.address}
      </p>
    </div>
  );
}
export default JobSidebar;