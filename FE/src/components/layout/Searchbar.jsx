import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { JOB_KEYWORDS } from "../../data/jobKeywords";

function Searchbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [showSuggest, setShowSuggest] = useState(false);

  const handleSearch = () => {
    const params = {};
    if (keyword.trim()) params.keyword = keyword;
    if (city.trim()) params.city = city;

    navigate({
      pathname: "/jobs",
      search: new URLSearchParams(params).toString(),
    });
  };

  const filteredSuggestions = JOB_KEYWORDS.filter((item) =>
    item.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 px-4">
      {/* INPUT KEYWORD */}
      <div className="relative w-full md:w-[600px]">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
          placeholder="Nhập công việc cần tìm..."
          className="w-full pl-4 pr-[140px] py-3 rounded-full border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* AUTOCOMPLETE GỢI Ý */}
        {showSuggest && keyword && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow mt-2 z-50">
            {filteredSuggestions.map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setKeyword(item);
                  setShowSuggest(false);

                  navigate({
                    pathname: "/jobs",
                    search: new URLSearchParams({ keyword: item }).toString(),
                  });
                }}
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                {item}
              </div>
            ))}
          </div>
        )}

        {/* SELECT CITY */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-gray-200 rounded-full px-2 py-2">
          <MapPinIcon className="h-5 w-5 text-gray-500" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-sm text-gray-700 focus:outline-none"
          >
            <option value="">Tất cả địa điểm</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </div>
      </div>

      {/* BUTTON SEARCH */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        Tìm kiếm
      </button>
    </div>
  );
}

export default Searchbar;
