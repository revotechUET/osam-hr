import { db } from "../db";

global.getSetting = getSetting;
export function getSetting() {
  const scriptCache = CacheService.getScriptCache();
  const cached = scriptCache.get('SETTING');
  if (cached) return JSON.parse(cached);
  const setting = db.from('setting').getDataJSON()[0];
  if (!setting) return null;
  setting.workDays = JSON.parse(setting.workDays);
  scriptCache.put('CONTRACT', JSON.stringify(setting), 21600);
  return setting;
}

global.updateSetting = updateSetting;
function updateSetting(setting) {
  const ok = db.from('setting').update(0, setting);
  if (ok) {
    const scriptCache = CacheService.getScriptCache();
    scriptCache.remove('SETTING');
  }
  return ok;
}
