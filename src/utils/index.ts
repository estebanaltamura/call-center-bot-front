import createPdfFromSystemPrompt from './createPdfFromSystemPrompt.ts/createPdfFromSystemPrompt';
import { simplePopUp } from './popUps/simplePopUp';
import { twoOptionsPopUp } from './popUps/twoOptionsPopUp';

const UTILS = {
  POPUPS: {
    simplePopUp: simplePopUp,
    twoOptionsPopUp: twoOptionsPopUp,
  },
  createPdfFromSystemPrompt: createPdfFromSystemPrompt,
};

export default UTILS;
