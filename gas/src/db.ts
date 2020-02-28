import { SpreadSheetDB } from 'gsheetdb';
import config from '../../config';

export const db = new SpreadSheetDB({
  ...config.spreadsheet,
  // init: true,
});
