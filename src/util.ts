import { parse, Day } from "date-fns";

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export type RRULE_WEEKDAY = "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA";
export type WPI_WEEKDAY = "SU" | "M" | "T" | "W" | "R" | "F" | "SA";

export const rRuleWeekdayMap: Record<WPI_WEEKDAY, RRULE_WEEKDAY> = {
  ["SU"]: "SU",
  ["M"]: "MO",
  ["T"]: "TU",
  ["W"]: "WE",
  ["R"]: "TH",
  ["F"]: "FR",
  ["SA"]: "SA",
};

export const dayIndexMap: Record<WPI_WEEKDAY, Day> = {
  ["SU"]: 0,
  ["M"]: 1,
  ["T"]: 2,
  ["W"]: 3,
  ["R"]: 4,
  ["F"]: 5,
  ["SA"]: 6,
};

const makeWPIWeekdayFromStrings = (strs: string[]): WPI_WEEKDAY[] => {
  const weekdays: WPI_WEEKDAY[] = [];

  for (let weekdayString of strs) {
    weekdayString = weekdayString.trim();

    if (dayIndexMap[weekdayString as WPI_WEEKDAY] === undefined) {
      throw new Error(`Invalid weekday: ${weekdayString}`);
    }

    weekdays.push(weekdayString as WPI_WEEKDAY);
  }

  return weekdays;
};

export class MeetingPattern {
  weekdays: WPI_WEEKDAY[];
  startTime: Date;
  endTime: Date;
  room: string;

  getRRuleWeekdays(): RRULE_WEEKDAY[] {
    return this.weekdays.map((weekday) => rRuleWeekdayMap[weekday]);
  }

  constructor(str: string) {
    const columns = str.split("|");

    this.weekdays = makeWPIWeekdayFromStrings(columns[0].split("-"));
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
