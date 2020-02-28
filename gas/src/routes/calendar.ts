// let calendarID = "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com";

// function getCalendarEvents(from, to) {
//     let calendar = CalendarApp.getCalendarById(calendarID);
//     let events = calendar.getEvents(new Date(from), new Date(to));
//     //return events;
//     return events.map(e=>({
//         title: e.getTitle(),
//         description: e.getDescription(),
//         startDate: e.getAllDayEndDate(),
//         endDate: e.getAllDayStartDate()
//     }));
// }
//global.getCalendarEvents = getCalendarEvents;

import config from '../../../config';

const calendarIds = config.calendarIds;

global.getEventsOfThisMonth = getEventsOfThisMonth;
global.createEvent = createEvent;
function _getCalendarEvents(calendarId, from, to) {
    return Calendar.Events.list(calendarId, {
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        singleEvents: false,
        maxResults: 100
    });
}
function _createEvent(calendarId, eventInfo) {
    return Calendar.Events.insert( eventInfo, calendarId);
}
function _loadEvents(calendarIdx, from, to) {
    var calendarId = calendarIds[calendarIdx];
    try {
        var events = _getCalendarEvents(calendarId, from, to);
        return {
            from: from.toISOString(),
            to: to.toISOString(),
            events: events.items.map(item => {
                var startDate = item.start.date || item.start.dateTime; 
                var endDate = item.end.date || item.end.dateTime || startDate;
                return {
                    id: item.id,
                    summary: item.summary,
                    description: item.description,
                    start: new Date(startDate).toISOString(),
                    end: new Date(endDate).toISOString()
                }
            }),
            rawEvents: events.items
        }
    }
    catch (e) {
        Logger.log('error' + e.message);
        return {
            error: e.message
        }
    }
}
function getEventsOfThisMonth({ calendarIdx = 0,  startDate = 1 }) {
    var now = new Date();
    var start = new Date(now);
    start.setDate(startDate);
    var month = now.getMonth();
    var end = new Date(start);
    end.setMonth(month + 1);
    return _loadEvents(calendarIdx, start, end);
}

function createEvent({calendarIdx = 0, summary, description, start, end, emails = []}) {
    var calendarId = calendarIds[calendarIdx];
    var event = _createEvent(calendarId,{
        summary, description, 
        start: {
            dateTime: start
        },
        end: {
            dateTime: end
        },
        attendees: emails.map(email => ({email}))
    });
    
    return event;
}
