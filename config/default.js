const sheetUrl = 'https://docs.google.com/spreadsheets/d/1uEYFEuYKH8gYHicVcTCDiICCQwyw0cvQ5ND64GMds8A/edit';

export default {
  calendarIds: ["rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com", "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com"], // [leave request, day-off]
  sheetUrl,
  spreadsheet: {
    source_url: sheetUrl,
    sheetSpecs: {
      user: ['id', 'email', 'role', 'name', 'active', 'idContract'],
      department: ['id', 'name', 'active', 'idManager', 'idApprovers'],
      user_department: ['id', 'idUser', 'idDepartment'],
      contract: ['id', 'name', 'type', 'lunch', 'leaveRequest'],
      checking: ['id', 'date', 'checkinTime', 'checkoutTime', 'reportContent', 'responseContent', 'reportStatus', 'idUser', 'note', 'point', 'lunch'],
      leave: ['id', 'startTime', 'endTime', 'reason', 'description', 'status', 'idRequester', 'idApprover'],
      notification: ['id', 'title', 'content', 'type', 'receipient', 'status'],
      setting: [
        ['id', 'welcomeMessage', 'monthEnd', 'yearEnd', 'morningStart', 'morningEnd', 'afternoonStart', 'afternoonEnd', 'lunchStart', 'lunchEnd', 'workDays', 'leavesPerYear'],
        ['0', 'Chúc bạn ngày mới vui vẻ', '1', '0', '1999-01-01T02:00:00.000Z', '1999-01-01T05:00:00.000Z', '1999-01-01T06:00:00.000Z', '1999-01-01T11:00:00.000Z', '1999-01-01T04:30:00.000Z', '1999-01-01T07:30:00.000Z', JSON.stringify([0, 3, 3, 3, 3, 3, 1]), '12']
      ],
    }
  },
}
