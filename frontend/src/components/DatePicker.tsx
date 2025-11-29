"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  label: string;
}

const DAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const MONTHS = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December"
];

export function DatePicker({ value, onChange, minDate, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    if (minDate) return new Date(minDate);
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // stäng vid klick utanför
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDateObj = minDate ? new Date(minDate) : today;
  minDateObj.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // måndag = 0, söndag = 6
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];

    // tomma dagar före
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // dagar i månaden
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date < minDateObj;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      selected.getDate() === day &&
      selected.getMonth() === viewDate.getMonth() &&
      selected.getFullYear() === viewDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const now = new Date();
    return (
      now.getDate() === day &&
      now.getMonth() === viewDate.getMonth() &&
      now.getFullYear() === viewDate.getFullYear()
    );
  };

  const handleSelectDate = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const formatted = date.toISOString().split("T")[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const canGoPrev = () => {
    const prevMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
    return prevMonthDate >= minDateObj;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  };

  const days = getDaysInMonth(viewDate);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs text-[var(--muted)] mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-left text-sm hover:border-[var(--muted)] transition-colors"
      >
        <Calendar className="w-4 h-4 text-[var(--muted)]" />
        <span className={value ? "text-[var(--foreground)]" : "text-[var(--muted)]"}>
          {value ? formatDisplayDate(value) : "Välj datum"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xl z-50 min-w-[280px]">
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev()}
              className="p-1.5 rounded-lg hover:bg-[var(--card)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--card)] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* veckodagar */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs text-[var(--muted)] py-1">
                {day}
              </div>
            ))}
          </div>

          {/* dagar */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square">
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    disabled={isDateDisabled(day)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-all
                      ${isDateSelected(day)
                        ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                        : isToday(day)
                          ? "border border-[var(--foreground)] font-medium"
                          : isDateDisabled(day)
                            ? "text-[var(--muted)]/40 cursor-not-allowed"
                            : "hover:bg-[var(--card)]"
                      }
                    `}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
