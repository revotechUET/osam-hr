export let db: AppLib.SpreadSheetDB;
export function init() {
  const sheetDBUrl = "https://docs.google.com/spreadsheets/d/1SRg3FBaOiS_8Tb7M7zgVeneXx45DiAsb9T8L-tClEHM/edit";
  db = new AppLib.SpreadSheetDB({
    source_url: sheetDBUrl,
    sheetSpecs: {},
  });
}
