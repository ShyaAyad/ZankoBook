import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery } from "@tanstack/react-query";

import { useUserStore } from "@/store/userStore";
import { getCalendarEvents } from "@/api/calendar";
import type { EventInput } from "@fullcalendar/core";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const CalendarPage = () => {
  const { user } = useUserStore();

  const today = new Date();

  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(today));

  const { data: events = [] } = useQuery({
    queryKey: ["calendar-events", user?.id, startDate, endDate],
    queryFn: () => getCalendarEvents({ startDate, endDate }),
    enabled: !!user,
  });

  return (
    <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events as EventInput[]}
        datesSet={({ start, end }) => {
          setStartDate(formatDate(start));
          const inclusiveEnd = new Date(end);
          inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
          setEndDate(formatDate(inclusiveEnd));
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listMonth",
        }}
        fixedWeekCount={false}
        dayMaxEvents={3}
        eventContent={({ event }) => (
          <div className="w-full truncate rounded-lg border border-orange-100 bg-orange-50 px-2 py-1 text-xs font-medium text-teal-700">
            {event.title}
          </div>
        )}
        dayCellClassNames={() => ["hover:bg-slate-50 transition-colors"]}
        dayHeaderClassNames={() => [
          "bg-slate-50 text-xs font-semibold uppercase text-slate-500",
        ]}
      />
    </div>
  );
};

export default CalendarPage;
