import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { JOB_KEYWORDS } from "../../data/jobKeywords";

function Searchbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || ""
  );
  const [city, setCity] = useState(
    searchParams.get("city") || ""
  );
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
    <div className="mt-8 px-4">
      <div
        className="
          max-w-5xl mx-auto
          bg-white border border-gray-200
          rounded-2xl shadow-sm
          p-4 flex flex-col md:flex-row
          items-stretch gap-4
        "
      >
        {/* ===== KEYWORD INPUT ===== */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSuggest(true)}
            onBlur={() =>
              setTimeout(() => setShowSuggest(false), 200)
            }
            placeholder="Tìm kiếm theo vị trí, kỹ năng, công việc..."
            className="
              w-full h-12 pl-12 pr-4
              rounded-xl border border-gray-300
              text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          />

          {/* ===== AUTOCOMPLETE ===== */}
          {showSuggest &&
            keyword &&
            filteredSuggestions.length > 0 && (
              <div
                className="
                  absolute top-full left-0 w-full mt-2
                  bg-white border border-gray-200
                  rounded-xl shadow-lg z-50
                  overflow-hidden
                "
              >
                {filteredSuggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setKeyword(item);
                      setShowSuggest(false);
                      navigate({
                        pathname: "/jobs",
                        search: new URLSearchParams({
                          keyword: item,
                        }).toString(),
                      });
                    }}
                    className="
                      px-4 py-3
                      text-sm text-gray-700
                      hover:bg-gray-50
                      cursor-pointer flex items-center gap-2
                    "
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    <span className="truncate">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* ===== LOCATION ===== */}
        <div
          className="
            flex items-center gap-2
            h-12 px-3
            rounded-xl border border-gray-300
            bg-gray-50
          "
        >
          <MapPinIcon className="h-5 w-5 text-gray-400" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="
              bg-transparent text-sm text-gray-700
              focus:outline-none
            "
          >
            <option value="">
              Tất cả địa điểm
            </option>
            <option value="Hồ Chí Minh">
              TP. Hồ Chí Minh
            </option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">
              Đà Nẵng
            </option>
          </select>
        </div>

        {/* ===== SEARCH BUTTON ===== */}
        <button
          onClick={handleSearch}
          className="
            h-12 px-8
            rounded-xl
            bg-green-600 text-white
            font-semibold text-sm
            flex items-center justify-center gap-2
            hover:bg-green-700
            transition
          "
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}

export default Searchbar;
