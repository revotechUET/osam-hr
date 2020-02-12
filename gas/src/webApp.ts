function doGet() {
    return HtmlService.createHtmlOutputFromFile("dist/index.html");
}
global.doGet = doGet;
