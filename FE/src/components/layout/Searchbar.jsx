import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import ProvinceDropdown from "./ProvinceDropdown";
import { JOB_KEYWORDS } from "../../data/jobKeywords";

function Searchbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestRef = useRef(null);

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
  const [debouncedKeyword, setDebouncedKeyword] =
    useState(keyword);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* =====================
     AUTO FOCUS
  ===================== */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* =====================
     DEBOUNCE KEYWORD
  ===================== */
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedKeyword(keyword),
      300
    );
    return () => clearTimeout(timer);
  }, [keyword]);

  /* =====================
     DISABLE CONDITION
  ===================== */
  const isSearchDisabled = useMemo(
    () => !keyword.trim() && !province.trim(),
    [keyword, province]
  );

  /* =====================
     AUTOCOMPLETE FILTER
  ===================== */
  const filteredSuggestions = useMemo(() => {
    if (!debouncedKeyword) return [];
    return JOB_KEYWORDS.filter((item) =>
      item.toLowerCase().includes(debouncedKeyword.toLowerCase())
    ).slice(0, 8);
  }, [debouncedKeyword]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedKeyword]);

  /* =====================
     SEARCH HANDLER
  ===================== */
  const handleSearch = (kw = keyword) => {
    if (!kw.trim() && !province.trim()) return;

    const params = {};
    if (kw.trim()) params.keyword = kw.trim();
    if (province.trim()) params.location = province.trim();

    navigate({
      pathname: "/jobs",
      search: new URLSearchParams(params).toString(),
    });

    setShowSuggest(false);
  };

  /* =====================
     KEYBOARD NAV
  ===================== */
  const handleKeyDown = (e) => {
    if (!showSuggest || filteredSuggestions.length === 0)
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        Math.min(i + 1, filteredSuggestions.length - 1)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const value = filteredSuggestions[activeIndex];
      setKeyword(value);
      handleSearch(value);
    }

    if (e.key === "Escape") {
      setShowSuggest(false);
    }
  };

  /* =====================
     HIGHLIGHT
  ===================== */
  const highlightText = (text, kw) => {
    if (!kw) return text;
    return text.split(new RegExp(`(${kw})`, "gi")).map((p, i) =>
      p.toLowerCase() === kw.toLowerCase() ? (
        <span
          key={i}
          className="text-emerald-600 font-semibold"
        >
          {p}
        </span>
      ) : (
        p
      )
    );
  };

  return (
    <div className="mt-12 px-4">
      <div
        className="
          max-w-6xl mx-auto
          bg-white border border-gray-200
          rounded-3xl shadow-xl
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
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSuggest(true);
            }}
            onFocus={() => setShowSuggest(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && activeIndex === -1) {
                handleSearch();
              }
              handleKeyDown(e);
            }}
            placeholder="Tìm kiếm vị trí, kỹ năng, công việc..."
            className="
              w-full h-12 pl-12 pr-10
              rounded-2xl border border-gray-300
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-emerald-500
              focus:border-emerald-500
              transition
            "
          />

          {/* CLEAR */}
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
          )}

          {/* AUTOCOMPLETE */}
          {showSuggest && filteredSuggestions.length > 0 && (
            <div
              ref={suggestRef}
              className="
                absolute top-full left-0 w-full mt-2
                bg-white border border-gray-200
                rounded-2xl shadow-xl
                z-50 overflow-hidden
              "
            >
              {filteredSuggestions.map((item, index) => (
                <div
                  key={item}
                  onMouseDown={() => {
                    setKeyword(item);
                    handleSearch(item);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`
                    px-4 py-3 text-sm cursor-pointer
                    flex items-center gap-2
                    ${
                      index === activeIndex
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-700"
                    }
                    hover:bg-emerald-50
                  `}
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
        <button
          onClick={() => handleSearch()}
          disabled={isSearchDisabled}
          title={
            isSearchDisabled
              ? "Nhập từ khóa hoặc chọn địa điểm"
              : ""
          }
          className={`
            h-12 px-8 rounded-2xl
            font-semibold text-sm
            flex items-center justify-center gap-2
            transition-all
            active:scale-[0.97]
            ${
              isSearchDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg"
            }
          `}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}

export default Searchbar;
