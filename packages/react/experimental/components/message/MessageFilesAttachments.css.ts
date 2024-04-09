import { globalStyle } from '../../../common/ui/style.js';
import * as classes from '../../../components/MessageContent.classnames.js';
export default classes;

const {
  messageImageAttachments,
  messageVideoAttachments,
  messageDocumentAttachments,
  messageLinkPreviews,
} = classes;

globalStyle(`.${messageImageAttachments}`, { gridArea: 'imageAttachments' });
globalStyle(`.${messageVideoAttachments}`, { gridArea: 'videoAttachments' });
globalStyle(`.${messageDocumentAttachments}`, {
  gridArea: 'documentAttachments',
});
globalStyle(`.${messageLinkPreviews}`, {
  gridArea: 'linkPreviews',
  width: '100%',
  overflowX: 'auto',
});
