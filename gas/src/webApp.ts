import { UserRole } from "./@types/contract";
import { userInfo } from "./utils";

function doGet() {
  const user = userInfo();
  if (user.role === UserRole.User) {
    return ContentService.createTextOutput('You do not have permission!');
  }
  return HtmlService.createHtmlOutputFromFile("dist/index.html")
    .setTitle('HR Admin')
    .setFaviconUrl('https://static.wixstatic.com/media/22ad9e_22cd33c6ec194e1297270a96384a88f3~mv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/22ad9e_22cd33c6ec194e1297270a96384a88f3~mv2.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}
global.doGet = doGet;
