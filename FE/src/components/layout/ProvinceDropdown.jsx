import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPinIcon,
  ChevronDownIcon,
  GlobeAltIcon,
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

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  /* =====================
     CLICK OUTSIDE → CLOSE
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
     NORMALIZE + FILTER
  ===================== */
  const items = useMemo(() => {
    const list = vnAddress.map((p) => ({
      name: getProvinceName(p),
      key: getProvinceKey(p),
    }));

    if (!keyword.trim()) return list;

    return list.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword]);

  useEffect(() => {
    setActiveIndex(0);
  }, [keyword]);

  /* =====================
     KEYBOARD NAVIGATION
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
      className="relative w-60 shrink-0"
    >
      {/* =====================
          TRIGGER BUTTON
      ===================== */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full h-12 px-4
          flex items-center justify-between
          rounded-xl border
          bg-white text-sm
          border-gray-300
          hover:border-green-500
          focus:outline-none focus:ring-2 focus:ring-green-500
          transition
        "
      >
        <span className="flex items-center gap-2 truncate text-gray-800">
          <MapPinIcon className="h-5 w-5 text-green-600 shrink-0" />
          {value || "Tất cả địa điểm"}
        </span>

        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* =====================
          DROPDOWN
      ===================== */}
      {open && (
        <div
          className="
            absolute top-full left-0 mt-2 w-full
            bg-white border border-gray-200
            rounded-2xl shadow-xl z-50
            overflow-hidden
            animate-fade-in
          "
        >
          {/* SEARCH */}
          <div className="p-3 border-b bg-gray-50">
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm tỉnh / thành phố..."
              className="
                w-full px-4 py-2.5 text-sm
                border rounded-xl
                text-gray-800
                focus:outline-none
                focus:ring-2 focus:ring-green-500
              "
            />
          </div>

          {/* LIST */}
          <div className="max-h-64 overflow-y-auto py-1">
            {/* ALL */}
            <div
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
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700"
                }
                hover:bg-green-50 hover:text-green-700
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
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(p.name);
                    setOpen(false);
                    setKeyword("");
                  }}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer
                    transition
                    ${
                      isActive
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-800"
                    }
                    hover:bg-green-50 hover:text-green-700
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
