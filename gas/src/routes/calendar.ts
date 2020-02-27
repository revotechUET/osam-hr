let calendarID = "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com";

function getCalendarEvents(from, to) {
    CalendarApp.getCalendarById(calendarID).getEvents(new Date(from), new Date(to));
}

global.getCalendarEvents = getCalendarEvents;