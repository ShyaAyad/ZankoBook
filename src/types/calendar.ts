import type { ApiResponse } from "./api";

export interface CalendarEventsQueryParams {
  startDate: string;
  endDate: string;
}
export interface AssignmentEvent {
  id: number;
  assessment_id: number;
  title: string;
  description: string;
  type: "assignment";
  due_at: string;

  course: {
    id: number;
    name: string;
    code: string;
  };

  is_submitted: boolean;
  is_overdue: boolean;

  submission: {
    id: number;
    submitted_at: string;
  } | null;
}

export type GetCalendarEventsResponse = ApiResponse<AssignmentEvent[]>;
