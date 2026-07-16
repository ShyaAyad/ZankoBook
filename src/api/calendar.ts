import api from "@/lib/axios";
import type {
  CalendarEventsQueryParams,
  GetCalendarEventsResponse,
} from "@/types/calendar";
import type { EventInput } from "@fullcalendar/core";

export async function getCalendarEvents(
  payload: CalendarEventsQueryParams,
): Promise<EventInput[]> {
  const response = await api.get<GetCalendarEventsResponse>(
    `/api/moodle/calendar-events?start_date=${payload.startDate}&end_date=${payload.endDate}`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  // Map the events to the format expected by FullCalendar
  return data.map((event) => ({
    id: event.id.toString(),
    title: event.title,
    start: event.due_at,
    allDay: false,

    // Everything else can live here
    extendedProps: {
      assignmentId: event.assessment_id,
      description: event.description,
      type: event.type,
      course: event.course,
      isSubmitted: event.is_submitted,
      isOverdue: event.is_overdue,
      submission: event.submission,
    },
  }));
}
