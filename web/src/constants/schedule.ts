export interface DayOption {
  id: string;
  label: string;
}

export const SCHEDULE_DAYS: DayOption[] = [
  { id: "Mon", label: "classPage.scheduleModal.days.Mon" },
  { id: "Tue", label: "classPage.scheduleModal.days.Tue" },
  { id: "Wed", label: "classPage.scheduleModal.days.Wed" },
  { id: "Thu", label: "classPage.scheduleModal.days.Thu" },
  { id: "Fri", label: "classPage.scheduleModal.days.Fri" },
  { id: "Sat", label: "classPage.scheduleModal.days.Sat" },
  { id: "Sun", label: "classPage.scheduleModal.days.Sun" },
];
