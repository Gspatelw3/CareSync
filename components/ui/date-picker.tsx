"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import "react-day-picker/style.css";
import "./date-picker.css";

export type DatePickerProps = {
  /** The currently selected date value (ISO string YYYY-MM-DD) */
  value?: string;
  /** Placeholder text shown when no date is selected */
  placeholder?: string;
  /** Callback with the selected date as YYYY-MM-DD, or empty string if cleared */
  onChange?: (value: string) => void;
  /** Disable the date picker */
  disabled?: boolean;
  /** The minimum selectable date */
  minDate?: Date;
  /** The maximum selectable date */
  maxDate?: Date;
  /** HTML id for the trigger button (for label association) */
  id?: string;
};

const DISPLAY_FORMAT = "dd MMM yyyy";
const VALUE_FORMAT = "yyyy-MM-dd";

/**
 * Parse a YYYY-MM-DD string into a Date object.
 */
function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, VALUE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

/**
 * A reusable, accessible date picker component that matches the Care Sync
 * design system. It renders a text trigger that looks exactly like other
 * form inputs, and opens a popover calendar on click.
 *
 * Built on react-day-picker v9 (MIT license, ~10KB gzipped).
 */
export function DatePicker({
  value,
  placeholder = "Select date...",
  onChange,
  disabled = false,
  minDate,
  maxDate,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const selected = value ? parseDate(value) : undefined;

  // Close the popover when clicking outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    // Use mousedown for more responsive closing
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    },
    [],
  );

  const handleDaySelect = useCallback(
    (day: Date | undefined) => {
      if (day) {
        onChange?.(format(day, VALUE_FORMAT));
      }
      setOpen(false);
      // Return focus to the trigger after selection
      triggerRef.current?.focus();
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.("");
    },
    [onChange],
  );

  const displayValue = selected
    ? format(selected, DISPLAY_FORMAT)
    : "";

  const disabledDays = [];
  if (minDate) disabledDays.push({ before: minDate });
  if (maxDate) disabledDays.push({ after: maxDate });

  return (
    <div className="date-picker-wrapper relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="date-picker-trigger"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          selected
            ? `Date: ${format(selected, DISPLAY_FORMAT)}`
            : placeholder
        }
      >
        {displayValue || (
          <span className="text-[var(--input-placeholder)]">
            {placeholder}
          </span>
        )}
      </button>

      {/* Calendar icon */}
      <CalendarIcon
        className="date-picker-icon size-4"
        aria-hidden="true"
      />

      {/* Clear button - only shown when a date is selected */}
      {selected && !disabled && (
        <button
          type="button"
          className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-muted-light)] hover:text-[var(--text-muted)] cursor-pointer"
          onClick={handleClear}
          aria-label="Clear date"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Popover calendar */}
      {open && (
        <div
          ref={popoverRef}
          className="date-picker-popover absolute left-0 z-70 mt-1"
          role="dialog"
          aria-label="Date picker calendar"
          onKeyDown={handleKeyDown}
        >
          <div className="date-picker-calendar rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] p-3 shadow-lg shadow-[var(--shadow-card)]">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleDaySelect}
              disabled={disabledDays.length > 0 ? disabledDays : undefined}
              defaultMonth={selected || new Date()}
              captionLayout="dropdown"
              startMonth={minDate || new Date(2020, 0)}
              endMonth={maxDate || new Date(2035, 11)}
              weekStartsOn={1} // Monday
              showOutsideDays
            />
          </div>
        </div>
      )}
    </div>
  );
}