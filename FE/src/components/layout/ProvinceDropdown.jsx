import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPinIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import vnAddress from "../../data/vn-address.json";

/* =====================
   HELPERS – KHÔNG ĐỤNG DATA GỐC
===================== */
const getProvinceName = (p) =>
  p.name || p.full_name || p.Name || "";

const getProvinceKey = (p) =>
  p.code || p.Id || getProvinceName(p);

function ProvinceDropdown({ value, onChange }) {
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  /* =====================
     CLICK OUTSIDE
  ===================== */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  /* =====================
     AUTO FOCUS SEARCH
  ===================== */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  /* =====================
     FILTER (MEMO)
  ===================== */
  const items = useMemo(() => {
    const list = vnAddress.map((p) => ({
      name: getProvinceName(p),
      key: getProvinceKey(p),
    }));

    if (!keyword.trim()) return list;

    const kw = keyword.toLowerCase();
    return list.filter((p) =>
      p.name.toLowerCase().includes(kw)
    );
  }, [keyword]);

  useEffect(() => {
    setActiveIndex(0);
  }, [keyword]);

  /* =====================
     SCROLL ACTIVE
  ===================== */
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* =====================
     KEYBOARD
  ===================== */
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        Math.min(i + 1, items.length)
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex === 0) {
        onChange("");
      } else {
        const item = items[activeIndex - 1];
        item && onChange(item.name);
      }
      setOpen(false);
      setKeyword("");
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full md:w-56 shrink-0"
    >
      {/* ================= TRIGGER ================= */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full h-12 px-4
          flex items-center justify-between
          rounded-xl border border-gray-300
          bg-white text-sm
          hover:border-emerald-500
          focus:outline-none focus:ring-2 focus:ring-emerald-500
          transition
        "
      >
        <span className="flex items-center gap-2 truncate text-gray-800">
          <MapPinIcon className="h-5 w-5 text-emerald-600 shrink-0" />
          {value || "Tất cả địa điểm"}
        </span>

        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div
          className="
            absolute top-full left-0 mt-2 w-full
            bg-white border border-gray-200
            rounded-xl shadow-lg z-50
            overflow-hidden
          "
        >
          {/* SEARCH */}
          <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tỉnh / thành phố..."
              className="
                flex-1 h-10 px-3
                text-sm border rounded-lg
                text-gray-800
                focus:outline-none
                focus:ring-2 focus:ring-emerald-500
              "
            />

            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="p-2 rounded-lg hover:bg-gray-200 transition"
                title="Xóa"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* LIST */}
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto py-1"
          >
            {/* ALL */}
            <div
              data-index={0}
              onMouseEnter={() => setActiveIndex(0)}
              onClick={() => {
                onChange("");
                setOpen(false);
                setKeyword("");
              }}
              className={`
                px-4 py-2.5 text-sm cursor-pointer
                flex items-center gap-2
                ${
                  activeIndex === 0
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-gray-700"
                }
                hover:bg-emerald-50
              `}
            >
              <GlobeAltIcon className="h-4 w-4 text-gray-400" />
              Tất cả địa điểm
            </div>

            <div className="h-px bg-gray-200 my-1" />

            {/* PROVINCES */}
            {items.map((p, idx) => {
              const index = idx + 1;
              const isActive = activeIndex === index;

              return (
                <div
                  key={p.key}
                  data-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(p.name);
                    setOpen(false);
                    setKeyword("");
                  }}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer
                    ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-800"
                    }
                    hover:bg-emerald-50
                  `}
                >
                  {p.name}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                Không tìm thấy tỉnh / thành
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProvinceDropdown;
