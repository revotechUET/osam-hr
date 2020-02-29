// import { SpreadSheetDB } from 'gsheetdb';
import { SpreadSheetDB } from '../../../gsheetdb';
import config from '../../config';
import { getService } from './services';

const service = getService();
export const db = new SpreadSheetDB({
  ...config.spreadsheet,
  accessToken: service.getAccessToken(),
  // init: true,
});
