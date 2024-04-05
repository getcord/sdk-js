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
