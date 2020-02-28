var calendarId = "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com";
function someFunc(items) {
  var now = new Date("2020-02-01T14:02:28.938Z");
  try {
    var events = Calendar.Events.list(calendarId, {
            timeMin: now.toISOString(),
            singleEvents: false,
            //orderBy: 'startTime',
            maxResults: 10
    });
    var eventItems = [];
    var item = null;
    for (var i =0; i < events.items.length; i++) {
      item = events.items[i];
      var startDate = item.start.date || item.start.dateTime;
      Logger.log(JSON.stringify(item));
      eventItems.push({
        summary: item.summary,
        id: item.id,
        start: new Date(startDate).toLocaleString()
      });
    };
    Logger.log(events.items.length);
    Logger.log(JSON.stringify(eventItems));
  }
  catch (e) {
    Logger.log('error:' + e.message);
    return {
      error: e.message
    }
  }
}

function createEvent() {
  var start = new Date();
  Logger.log(start);
  //var calendarId = "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com";
  var event = {
    summary: "Event 1",
    description: 'To discuss our plans for the presentation next week.',
    start: {
      date: start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate()
    },
    end: {
      date: start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate()
    }
  }
  var gEvent = Calendar.Events.insert(event, calendarId);
  Logger.log(JSON.stringify(gEvent));
}

