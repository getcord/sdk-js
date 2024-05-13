import React, { forwardRef } from 'react';
import cx from 'classnames';
import { Button, Facepile } from '../../betaV2.js';
import type { StyleProps } from '../../betaV2.js';
import { fontSmall } from '../../common/ui/atomicClasses/fonts.css.js';
import { useCordTranslation } from '../../index.js';
import type { MandatoryReplaceableProps } from '../../experimental/components/replacements.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import classes from './Threads.css.js';

export type InlineReplyButtonProps = {
  onClick: () => void;
  unreadCount: number;
  replyCount: number;
  allRepliersIDs: string[];
} & StyleProps &
  MandatoryReplaceableProps;

export const InlineReplyButton = withCord<
  React.PropsWithChildren<InlineReplyButtonProps>
>(
  forwardRef(function InlineReplyButton(
    {
      className,
      unreadCount,
      replyCount,
      allRepliersIDs,
      ...restProps
    }: InlineReplyButtonProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('thread_preview');

    return (
      <div
        className={cx(classes.inlineReplyButton, fontSmall, className)}
        ref={ref}
        {...restProps}
      >
        <Facepile.ByID userIDs={allRepliersIDs} canBeReplaced />
        <Button
          buttonAction="expand-replies"
          canBeReplaced
          className={fontSmall}
        >
          {unreadCount > 0
            ? t('show_replies_action_unread', { count: unreadCount })
            : t('show_replies_action_read', { count: replyCount })}
        </Button>
      </div>
    );
  }),
  'InlineReplyButton',
);
