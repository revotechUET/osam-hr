function myFunction() {
    var now = new Date();
    var calendarId = "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com";
    try {
        Logger.log("data in:" + JSON.stringify(items));
        var events = Calendar.Events.list(calendarId, {
            timeMin: now.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 10
        })
        return {
            events: events.items.map(item => {
                var startDate = item.start.date || item.start.dateTime;
                return {
                    description: item.description,
                    start: new Date(startDate).toLocaleString()
                }
            })
        }
    }
    catch (e) {
        Logger.log('error' + e.message);
        return {
            error: e.message
        }
    }
}
