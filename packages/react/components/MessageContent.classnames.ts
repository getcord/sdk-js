import { cordifyClassname } from '../common/util';

export const messageContent = cordifyClassname('message-content');
export const messageAttachment = cordifyClassname('message-attachment');
export const messageImageAttachments = cordifyClassname(
  'message-image-attachments',
);
export const messageDocumentAttachments = cordifyClassname(
  'message-document-attachments',
);
export const messageAnnotationAttachments = cordifyClassname(
  'message-annotation-attachments',
);

export const messageContentClassnamesDocs = {
  [messageContent]:
    'Applied to the div containing the text and attachments of the message and any attachments. You can use `grid-template-areas` to modify the layout of the message content elements.',
  [messageAttachment]:
    'Applied to each attachment type div. The images, documents and annotations.',
  [messageImageAttachments]:
    'Applied to the div that contains image attachments.',
  [messageDocumentAttachments]:
    'Applied to the div that contains document attachments.',
  [messageAnnotationAttachments]:
    'Applied to the div that contains annotation attachments.',
};
