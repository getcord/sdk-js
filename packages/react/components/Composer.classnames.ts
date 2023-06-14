import { cordifyClassname } from '../common/util';

// To avoid circular dependencies between various composer css files we put the classes here.

export const composerContainer = cordifyClassname('composer');
export const large = cordifyClassname('large');
export const medium = cordifyClassname('medium');
export const small = cordifyClassname('small');
export const expanded = cordifyClassname('expanded');
export const composerButtonsContainer = cordifyClassname('composer-menu');
export const primaryButtonsGroup = cordifyClassname('composer-primary-buttons');
export const secondaryButtonsGroup = cordifyClassname(
  'composer-secondary-buttons',
);
export const active = cordifyClassname('active');

export const editorContainer = cordifyClassname('editor-container');
export const editorSubContainer = cordifyClassname('editor-sub-container');
export const editor = cordifyClassname('editor');
export const editorSlot = cordifyClassname('editor-slot');
export const placeholder = cordifyClassname('placeholder');

export const userReferenceSuggestionsMenu = cordifyClassname('mention-menu');

export const attachmentsContainer = cordifyClassname('attachments');
