import { cordifyClassname } from '../common/util.js';

// To avoid circular dependencies between various composer css files we put the classes here.

export const composerContainer = cordifyClassname('composer');
export const large = cordifyClassname('large');
export const medium = cordifyClassname('medium');
export const small = cordifyClassname('small');
export const empty = cordifyClassname('empty');
export const valid = cordifyClassname('valid');
export const alwaysExpand = cordifyClassname('always-expand');
export const neverExpand = cordifyClassname('never-expand');
export const autoExpand = cordifyClassname('auto-expand');
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
export const hasAttachments = cordifyClassname('has-attachments');
export const collapsedComposerSelector = `.${composerContainer}:not(.${hasAttachments}):is(.${neverExpand}, .${autoExpand}:not(:focus-within))`;
