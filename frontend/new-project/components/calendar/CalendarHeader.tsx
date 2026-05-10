import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "@/utils/calendarHelpers";

interface CalendarHeaderProps {
  currentDate: Date;
  googleConnected: boolean;
  onToday: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({
  currentDate,
  googleConnected,
  onToday,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-3 py-3 sm:px-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
        <button
          onClick={onToday}
          className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-400 text-xs">
            {new Date().getDate()}
          </div>
          Today
        </button>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            className="rounded p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={onNextMonth}
            className="rounded p-2 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <h2 className="text-base font-normal text-gray-800 sm:text-lg md:text-xl">
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
      </div>
      <div
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${googleConnected ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}
      >
        <Calendar className="h-3.5 w-3.5" />
        {googleConnected ? "Google syncing" : "Google not connected"}
      </div>
    </div>
  );
}
