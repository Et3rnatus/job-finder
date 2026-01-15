import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ProvinceDropdown from "./ProvinceDropdown";
import { JOB_KEYWORDS } from "../../data/jobKeywords";

function Searchbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  /* =====================
     STATE
  ===================== */
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || ""
  );

  const [province, setProvince] = useState(
    searchParams.get("location") || ""
  );

  const [showSuggest, setShowSuggest] = useState(false);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  /* =====================
     AUTO FOCUS
  ===================== */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* =====================
     DEBOUNCE
  ===================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  /* =====================
     DISABLE CONDITION
  ===================== */
  const isSearchDisabled = useMemo(() => {
    return !keyword.trim() && !province.trim();
  }, [keyword, province]);

  /* =====================
     SEARCH HANDLER
  ===================== */
  const handleSearch = () => {
    if (isSearchDisabled) return;

    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (province.trim()) params.location = province.trim();

    navigate({
      pathname: "/jobs",
      search: new URLSearchParams(params).toString(),
    });

    setShowSuggest(false);
  };

  /* =====================
     AUTOCOMPLETE
  ===================== */
  const filteredSuggestions = useMemo(() => {
    if (!debouncedKeyword) return [];
    return JOB_KEYWORDS.filter((item) =>
      item.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword]);

  const highlightText = (text, kw) => {
    if (!kw) return text;

    const parts = text.split(
      new RegExp(`(${kw})`, "gi")
    );

    return parts.map((part, i) =>
      part.toLowerCase() === kw.toLowerCase() ? (
        <span key={i} className="text-green-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="mt-10 px-4">
      <div
        className="
          max-w-6xl mx-auto
          bg-white border border-gray-200
          rounded-2xl shadow-lg
          p-4
          flex flex-col md:flex-row
          items-stretch gap-4
        "
      >
        {/* =====================
            KEYWORD INPUT
        ===================== */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSuggest(true)}
            onBlur={() =>
              setTimeout(() => setShowSuggest(false), 150)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSearchDisabled) {
                handleSearch();
              }
              if (e.key === "Escape") {
                setShowSuggest(false);
              }
            }}
            placeholder="Tìm kiếm theo vị trí, kỹ năng, công việc..."
            className="
              w-full h-12 pl-12 pr-4
              rounded-xl border border-gray-300
              text-sm text-gray-800
              bg-white
              focus:outline-none
              focus:ring-2 focus:ring-green-500
              focus:border-green-500
              transition
            "
          />

          {/* =====================
              AUTOCOMPLETE
          ===================== */}
          {showSuggest &&
            debouncedKeyword &&
            filteredSuggestions.length > 0 && (
              <div
                className="
                  absolute top-full left-0 w-full mt-2
                  bg-white border border-gray-200
                  rounded-2xl shadow-xl
                  z-50 overflow-hidden
                "
              >
                {filteredSuggestions.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    onMouseDown={() => {
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
                      cursor-pointer
                      flex items-center gap-2
                      hover:bg-green-50
                      transition
                    "
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    <span className="truncate">
                      {highlightText(item, debouncedKeyword)}
                    </span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* =====================
            LOCATION
        ===================== */}
        <ProvinceDropdown value={province} onChange={setProvince} />

        {/* =====================
            SEARCH BUTTON
        ===================== */}
        <div
          title={
            isSearchDisabled
              ? "Vui lòng nhập từ khóa hoặc chọn địa điểm"
              : ""
          }
        >
          <button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className={`
              h-12 px-8
              rounded-xl
              font-semibold text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              active:scale-[0.98]
              ${
                isSearchDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
              }
            `}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
