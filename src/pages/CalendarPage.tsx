import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  List,
  X,
} from "lucide-react";

import { getCalendarEvents } from "@/api/calendar";
import { getCourseColor } from "@/lib/courseColor";
import { useUserStore } from "@/store/userStore";
import type { AssignmentEvent } from "@/types/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type ViewMode = "calendar" | "list";

function apiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function eventDateKey(event: AssignmentEvent): string {
  return event.due_at.slice(0, 10);
}

function buildMonthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function monthRange(month: Date) {
  const grid = buildMonthGrid(month);
  return {
    startDate: apiDate(grid[0]),
    endDate: apiDate(grid[grid.length - 1]),
  };
}

function formatDateTime(value: string): string {
  const date = new Date(value.replace(" ", "T"));
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function DayEventsDialog({
  events,
  onClose,
  onOpen,
}: {
  events: AssignmentEvent[];
  onClose: () => void;
  onOpen: (event: AssignmentEvent) => void;
}) {
  if (events.length === 0) return null;

  const title = new Date(events[0].due_at.replace(" ", "T")).toLocaleDateString(
    [],
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-600">Events</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
            aria-label="Close events"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {events.map((event) => {
            const color = getCourseColor(event.course);
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onOpen(event)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-teal-300 hover:bg-slate-50"
              >
                <span
                  className="h-11 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-900">
                    {event.title}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {event.course.code} · {event.course.name}
                  </span>
                </span>
                <ChevronRight size={19} className="shrink-0 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const role = user?.roles[0]?.name;
  const [mode, setMode] = useState<ViewMode>("calendar");
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedEvents, setSelectedEvents] = useState<AssignmentEvent[]>([]);

  const range = useMemo(() => monthRange(month), [month]);
  const grid = useMemo(() => buildMonthGrid(month), [month]);

  const query = useQuery({
    queryKey: ["calendar-events", user?.id, range.startDate, range.endDate],
    queryFn: () => getCalendarEvents(range),
    enabled: Boolean(user && role === "student"),
  });

  const events = query.data ?? [];
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, AssignmentEvent[]>();
    events.forEach((event) => {
      const key = eventDateKey(event);
      grouped.set(key, [...(grouped.get(key) ?? []), event]);
    });
    return grouped;
  }, [events]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.due_at.localeCompare(b.due_at)),
    [events],
  );

  if (role === "lecturer") return <Navigate to="/" replace />;

  const openAssignment = (event: AssignmentEvent) => {
    setSelectedEvents([]);
    navigate(`/calendar/assignments/${event.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Assignments and important due dates
          </p>
        </div>

        <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {(["calendar", "list"] as ViewMode[]).map((value) => {
            const active = mode === value;
            const Icon = value === "calendar" ? CalendarDays : List;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-teal-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={17} />
                {value === "calendar" ? "Calendar" : "List"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setMonth(
              (current) =>
                new Date(current.getFullYear(), current.getMonth() - 1, 1),
            )
          }
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={() =>
            setMonth(
              new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            )
          }
          className="text-xl font-extrabold text-slate-900"
        >
          {month.toLocaleDateString([], { month: "long", year: "numeric" })}
        </button>

        <button
          type="button"
          onClick={() =>
            setMonth(
              (current) =>
                new Date(current.getFullYear(), current.getMonth() + 1, 1),
            )
          }
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {query.isLoading ? (
        <div className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white">
          <p className="text-sm font-medium text-slate-500">Loading calendar…</p>
        </div>
      ) : query.isError ? (
        <div className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white p-6 text-center">
          <div>
            <p className="font-bold text-slate-900">Could not load calendar</p>
            <p className="mt-2 text-sm text-slate-500">
              {(query.error as Error).message}
            </p>
            <button
              type="button"
              onClick={() => query.refetch()}
              className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      ) : mode === "calendar" ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {grid.map((day) => {
              const key = apiDate(day);
              const dayEvents = eventsByDate.get(key) ?? [];
              const inMonth = day.getMonth() === month.getMonth();
              const isToday = key === apiDate(new Date());
              const colors = [
                ...new Set(dayEvents.map((event) => getCourseColor(event.course))),
              ];

              return (
                <button
                  key={key}
                  type="button"
                  disabled={dayEvents.length === 0}
                  onClick={() => setSelectedEvents(dayEvents)}
                  className="flex h-24 min-w-0 flex-col items-center border-b border-r border-slate-200 p-2 transition last:border-r-0 enabled:hover:bg-slate-50 sm:h-28"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                      isToday
                        ? "bg-teal-600 text-white"
                        : inMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  <span className="mt-3 flex min-h-4 max-w-full items-center justify-center gap-1">
                    {colors.slice(0, 3).map((color) => (
                      <span
                        key={color}
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="ml-0.5 text-[11px] font-bold text-slate-500">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="border-t border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
              No events this month.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEvents.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
              No events this month.
            </div>
          ) : (
            sortedEvents.map((event) => {
              const color = getCourseColor(event.course);
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openAssignment(event)}
                  className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className="w-2 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex min-w-0 flex-1 items-center gap-4 p-4">
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">
                          {event.title}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {event.course.code}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        {event.course.name}
                      </span>
                      <span className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Clock3 size={16} />
                        {formatDateTime(event.due_at)}
                      </span>
                    </span>
                    <ChevronRight size={21} className="shrink-0 text-slate-400" />
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      <DayEventsDialog
        events={selectedEvents}
        onClose={() => setSelectedEvents([])}
        onOpen={openAssignment}
      />
    </div>
  );
};

export default CalendarPage;
