import { parse } from "date-fns";

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const rRuleWeekdayMap = {
  SU: "SU",
  M: "MO",
  T: "TU",
  W: "WE",
  R: "TH",
  F: "FR",
  SA: "SA",
};

export const dayIndexMap = {
  SU: 0,
  M: 1,
  T: 2,
  W: 3,
  R: 4,
  F: 5,
  SA: 6,
};

export class MeetingPattern {
  weekdays: string[];
  startTime: Date;
  endTime: Date;
  room: string;

  constructor(str: string) {
    const columns = str.split("|");
    this.weekdays = columns[0].split("-").map((d) => d.trim());
    this.startTime = parse(
      columns[1].split("-")[0].trim(),
      "h:mm a",
      new Date()
    );
    this.endTime = parse(columns[1].split("-")[1].trim(), "h:mm a", new Date());
    this.room = columns[2].trim();
  }
}

export class Section {
  name: string;
  instrutor: string;
  meetingPattern: MeetingPattern;
  startDate: Date;
  endDate: Date;
}
