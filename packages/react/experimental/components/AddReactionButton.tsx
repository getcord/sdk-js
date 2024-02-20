import * as React from 'react';
import cx from 'classnames';

import { forwardRef, useCallback } from 'react';
import { isViewerPreviouslyAddedReaction } from '../../common/util.js';
import { useViewerData } from '../../hooks/user.js';
import { useMessage } from '../../hooks/thread.js';
import * as classes from '../../components/Reactions.classnames.js';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';
import { useEmojiPicker } from './helpers/EmojiPicker.js';
import { Button } from './helpers/Button.js';
import type { GeneralButtonProps } from './helpers/Button.js';

import withCord from './hoc/withCord.js';

export type AddReactionButtonProps = {
  messageId?: string;
  onDeleteReaction: (unicodeReaction: string) => void;
  onAddReaction: (unicodeReaction: string) => void;
} & Omit<GeneralButtonProps, 'buttonAction'>;

export const AddReactionButton = withCord(
  forwardRef(function AddReactionButton(
    props: AddReactionButtonProps,
    ref?: React.ForwardedRef<HTMLButtonElement>,
  ) {
    const {
      className,
      messageId,
      onAddReaction,
      onDeleteReaction,
      ...restProps
    } = props;
    // [ONI]-TODO If `WithTooltip` was inside this component, when
    // devs replaced it, they would have to add their own tooltip.
    // If `WithTooltip` was the parent of this component, when devs
    // replaced it, they would have to make sure to pass refs and props
    // correctly for the tooltip to work.

    const viewerData = useViewerData();
    const message = useMessage(messageId ?? '');
    const reactions = message?.reactions;
    const handleAddReactionClick = useCallback(
      (unicodeReaction: string) => {
        if (!reactions) {
          return;
        }
        isViewerPreviouslyAddedReaction(
          viewerData?.id ?? '',
          reactions,
          unicodeReaction,
        )
          ? onDeleteReaction(unicodeReaction)
          : onAddReaction(unicodeReaction);
      },
      [reactions, onAddReaction, onDeleteReaction, viewerData?.id],
    );

    const addReactionElement = (
      <Button
        canBeReplaced
        className={cx(
          className,
          classes.addReaction,
          buttonClasses.colorsSecondary,
          buttonClasses.small,
        )}
        icon="AddEmoji"
        type="button"
        {...restProps}
        buttonAction="select-emoji"
        ref={ref}
      />
    );
    const { EmojiPicker } = useEmojiPicker(
      addReactionElement,
      handleAddReactionClick,
    );

    return <>{EmojiPicker}</>;
  }),
  'AddReactionButton',
);
