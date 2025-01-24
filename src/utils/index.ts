import { timestampToDate } from './date/timestampToDate';
import createPdf from './pdf/createPdf';
import { simplePopUp } from './popUps/simplePopUp';
import { twoOptionsPopUp } from './popUps/twoOptionsPopUp';

const UTILS = {
  POPUPS: {
    simplePopUp: simplePopUp,
    twoOptionsPopUp: twoOptionsPopUp,
  },
  PDF: {
    createPdfFromSystemPrompt: createPdf,
  },
  DATES: {
    timestampToDate: timestampToDate,
  },
};

export default UTILS;
