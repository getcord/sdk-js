import { MODIFIERS } from '../common/ui/modifiers.js';
import { cordifyClassname } from '../common/util.js';

export const avatarContainer = cordifyClassname('avatar-container');
export const avatarFallback = cordifyClassname('avatar-fallback');
export const avatarImage = cordifyClassname('avatar-image');

export const { present, notPresent, loading } = MODIFIERS;
