import { globalStyle } from '../common/ui/style.js';
import * as classes from './MessageContent.classnames.js';
export default classes;

const { messageContent } = classes;

globalStyle(`.${messageContent}`, {
  gridArea: 'messageContent',
  display: 'grid',
  gridTemplateColumns: '100%',
  gridTemplateAreas: `
    "messageText"
    "imageAttachments"
    "videoAttachments"
    "documentAttachments"
    "linkPreviews"`,
});
