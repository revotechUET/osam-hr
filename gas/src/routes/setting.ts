import { db } from "../db";

global.getSetting = getSetting;
export function getSetting() {
  const setting = db.from('setting').getDataJSON()[0];
  if (!setting) return null;
  setting.workDays = JSON.parse(setting.workDays);
  return setting;
}

global.updateSetting = updateSetting;
function updateSetting(setting) {
  return db.from('setting').update(0, setting);
}
