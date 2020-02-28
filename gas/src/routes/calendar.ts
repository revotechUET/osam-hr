let calendarID = "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com";

function getCalendarEvents(from, to) {
    let calendar = CalendarApp.getCalendarById(calendarID);
    let events = calendar.getEvents(new Date(from), new Date(to));
    return events;
    return events.map(e=>({
        title: e.getTitle(),
        description: e.getDescription(),
        startDate: e.getAllDayEndDate(),
        endDate: e.getAllDayStartDate()
    }));
}

global.getCalendarEvents = getCalendarEvents;