function doGet() {
  return HtmlService.createHtmlOutputFromFile("dist/index.html")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}
global.doGet = doGet;
