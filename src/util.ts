import { parse } from "date-fns";

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const weekdayMap = {
  SU: "SU",
  M: "MO",
  T: "TU",
  W: "WE",
  R: "TH",
  F: "FR",
  SA: "SA",
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
