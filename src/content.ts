import jquery from "jquery";
import { add, format, intervalToDuration, parse, nextDay } from "date-fns";
import { createEvents, EventAttributes, ReturnObject } from "ics";
import {
  MeetingPattern,
  Section,
  sleep,
  rRuleWeekdayMap,
  dayIndexMap,
} from "./util";

window["$"] = jquery; // for esbuild to bundle jquery

async function waitForViewScheduleButton(): Promise<JQuery<HTMLElement>> {
  while (true) {
    await sleep(1000);
    const viewScheduleButton = $("button[title='View Schedule']");
    if (viewScheduleButton.length) {
      return viewScheduleButton;
    }
  }
}

function addNewButton(
  viewScheduleButton: JQuery<HTMLElement>
): JQuery<HTMLElement> {
  if ($("#convertToIcsButton").length) {
    return $("#convertToIcsButton");
  }

  const newButton = viewScheduleButton.clone().insertAfter(viewScheduleButton);

  newButton.attr("id", "convertToIcsButton");
  newButton.find("span[title='View Schedule']").text("Download ICS");

  return newButton;
}

function readSchedule(): Section[] {
  let sections: Section[] = [];

  $("tbody tr").each((_, e) => {
    const columnTexts = $(e)
      .children("td")
      .map((_, e) => $(e).text());

    const section = new Section();

    // No meeting times
    if (columnTexts[7] == "") {
      return;
    }

    try {
      section.name = columnTexts[4].trim();
      section.meetingPattern = new MeetingPattern(columnTexts[7].trim());
      section.instrutor = columnTexts[9].trim().replace("Instructor", "");
      section.startDate = parse(
        columnTexts[10].trim(),
        "MM/dd/yyyy",
        new Date()
      );
      section.endDate = parse(columnTexts[11].trim(), "MM/dd/yyyy", new Date());
      sections.push(section);
    } catch (error) {}
  });

  return sections;
}

function createICS(sections: Section[]): ReturnObject {
  let events: EventAttributes[] = [];

  sections.forEach((section) => {
    let startDate = section.startDate;
    const endDateRrule = format(add(section.endDate, { days: 1 }), "yyyyMMdd"); // Rrrule stops on this date
    const interval = intervalToDuration({
      start: section.meetingPattern.startTime,
      end: section.meetingPattern.endTime,
    });

    const firstMeetingDay = dayIndexMap[section.meetingPattern.weekdays[0]];

    if (startDate.getDay() !== firstMeetingDay) {
      startDate = nextDay(startDate, firstMeetingDay);
    }

    events.push({
      title: section.name,
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        section.meetingPattern.startTime.getHours(),
        section.meetingPattern.startTime.getMinutes(),
      ],
      description:
        section.instrutor !== "" ? `Instructor: ${section.instrutor}` : "",
      duration: { hours: interval.hours, minutes: interval.minutes },
      location: section.meetingPattern.room,
      recurrenceRule: `FREQ=WEEKLY;BYDAY=${section.meetingPattern.weekdays
        .map((wd) => rRuleWeekdayMap[wd])
        .join(",")};UNTIL=${endDateRrule}`,
    });
  });

  return createEvents(events);
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/calendar;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

async function setup() {
  const newButton = await waitForViewScheduleButton().then(addNewButton);

  newButton.off();

  newButton.on("click", () => {
    const sections = readSchedule();

    if (sections.length == 0) {
      alert(
        'No classes found. Did you turn off "Turn off the new tables view?"'
      );
      return;
    }

    const calendar = createICS(sections);

    if (calendar.value) {
      download("schedule.ics", calendar.value);
      alert(
        "Keep in mind you will have to make manual adjustments for any days off or special schedules."
      );
    } else {
      alert("An error occured: " + calendar.error);
    }
  });
}

setup();
