import { db } from "../db";

const defaultSetting = {
  id: 0,
  welcomeMessage: '',
  monthEnd: 1,
  yearEnd: 0,
  morningStart: '1970-01-01T01:00:00.000Z',
  morningEnd: '1970-01-01T04:30:00.000Z',
  afternoonStart: '1970-01-01T05:00:00.000Z',
  afternoonEnd: '1970-01-01T10:00:00.000Z',
  lunchStart: '1970-01-01T03:30:00.000Z',
  lunchEnd: '1970-01-01T06:30:00.000Z',
  // 0: off | 1: morning only, 2: afternoon only, 3: all-day
  // start from sunday
  workDays: [0, 3, 3, 3, 3, 3, 1],
}

global.getSetting = getSetting;
function getSetting() {
  const setting = db.from('setting').getDataJSON()[0];
  if (!setting) {
    db.from('setting').insert(defaultSetting);
    return defaultSetting;
  }
  setting.workDays = JSON.parse(setting.workDays);
  return setting;
}

global.updateSetting = updateSetting;
function updateSetting(setting) {
  db.from('setting').update('0', setting);
}
