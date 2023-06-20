import { cordifyClassname } from '../common/util';

export const reactionListContainer = cordifyClassname(
  'reaction-list-container',
);
export const pill = cordifyClassname('pill');
export const viewerReaction = cordifyClassname('viewer-reaction');
export const emoji = cordifyClassname('emoji');
export const count = cordifyClassname('count');

export const reactionListClassnamesDocs = {
  [reactionListContainer]:
    'Applied to the container div. This class is always present.',
  [pill]:
    'Applied to the div element containing the emoji unicode and the number of reactions.',
  [viewerReaction]:
    'Applied to the reaction pill that contains a reaction that the viewer has already reacted with.',
  [emoji]: 'Applied to the span element containing the emoji unicode.',
  [count]: 'Applied to the p element containing the number of reactions.',
};
