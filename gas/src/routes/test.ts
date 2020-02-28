import { format } from "date-fns";
import template from '../email-templates/new-leave-request.html';

global.test = test;
function test(args) {
  console.log("Remaining email quota: " + MailApp.getRemainingDailyQuota());
  const htmlTemplate = HtmlService.createTemplate(template);
  htmlTemplate.requester = 'Ho ten';
  htmlTemplate.startTime = format(new Date(2020, 1, 27), 'HH:mm dd/MM/yyyy');
  htmlTemplate.endTime = format(new Date(2020, 1, 28), 'HH:mm dd/MM/yyyy');
  htmlTemplate.reason = 'Khác';
  htmlTemplate.description = 'Ốm oyyyy';
  const htmlBody = htmlTemplate.evaluate().getContent();
  MailApp.sendEmail({
    to: ['user2@rvtcompany.page', 'quangln2810@gmail.com'].join(','),
    subject: `Ho ten đã gửi yêu cầu nghỉ`,
    htmlBody,
    noReply: true,
  })
}
