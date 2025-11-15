import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/solid";

function Searchbar() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 px-4">
      {/* Ô tìm kiếm gộp */}
      <div className="relative w-full md:w-[600px]">
        <input
          type="text"
          placeholder="Nhập công việc cần tìm..."
          className="w-full pl-4 pr-[140px] py-3 rounded-full border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Dropdown địa điểm nằm bên phải trong ô input */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-gray-200 rounded-full px-2 py-2">
          <MapPinIcon className="h-5 w-5 text-gray-500" />
          <select className="bg-transparent text-sm text-gray-700 focus:outline-none">
            <option value="">Tất cả địa điểm</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="hn">Hà Nội</option>
            <option value="dn">Đà Nẵng</option>
          </select>
        </div>
      </div>

      {/* Nút tìm kiếm */}
      <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400">
        <MagnifyingGlassIcon className="h-5 w-5" />
        Tìm kiếm
      </button>
    </div>
  );
}

export default Searchbar;
