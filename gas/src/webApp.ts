import { googleUser } from "./utils";

function doGet() {
  // const gUser = googleUser();
  // if (!gUser.isAdmin) return ContentService.createTextOutput('You do not have permission');
  return HtmlService.createHtmlOutputFromFile("dist/index.html")
    .setTitle('HR Admin')
    // .setFaviconUrl()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}
global.doGet = doGet;
