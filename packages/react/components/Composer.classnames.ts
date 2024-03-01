import { cordifyClassname } from '../common/util.js';

// To avoid circular dependencies between various composer css files we put the classes here.

export const composerContainer = cordifyClassname('composer');
export const large = cordifyClassname('large');
export const medium = cordifyClassname('medium');
export const small = cordifyClassname('small');
export const empty = cordifyClassname('empty');
export const valid = cordifyClassname('valid');
export const expanded = cordifyClassname('expanded');
export const composerButtonsContainer = cordifyClassname('composer-menu');
export const primaryButtonsGroup = cordifyClassname('composer-primary-buttons');
export const secondaryButtonsGroup = cordifyClassname(
  'composer-secondary-buttons',
);
export const composerErrorMessage = cordifyClassname('composer-error-message');

export const editorContainer = cordifyClassname('editor-container');
export const editor = cordifyClassname('editor');
export const editorSlot = cordifyClassname('editor-slot');
export const placeholder = cordifyClassname('placeholder');

export const userReferenceSuggestionsMenu = cordifyClassname('mention-menu');

export const attachmentsContainer = cordifyClassname('attachments');

export const composerClassnamesDocs = {
  [composerContainer]:
    'Applied to the container div. This class is always present.',
  [expanded]:
    'Applied to the container div when the composer is expanded, usually on focus, or when some text is already there.',
  [editorContainer]: 'Applied to the div containing the editor.',
  [composerButtonsContainer]:
    'Applied to the div containing the primary and secondary buttons.',
  [placeholder]: 'Applied to the typing placeholder.',
  [attachmentsContainer]:
    'Applied to the div containing the attachments (files and images).',
  [composerErrorMessage]:
    'Applied to the div containing the error message that appears when a message fails to send',
  [empty]:
    'Applied when the composer is empty, i.e. when the user has not typed anything. This class goes away when any character is typed in the composer',
  [valid]:
    'Applied only when the message is valid and ready to be sent. A valid message has either some characters in it (but not just spaces), or one or more attachments.',
  [primaryButtonsGroup]:
    'Applied to the container div used to group the primary buttons (send, cancel) together. By default it sits on the right of the composer menu.',
  [secondaryButtonsGroup]:
    'Applied to the container div used to group the secondary buttons (mentions, attachments, etc) together. By default it sits on the left of the composer menu.',
};
