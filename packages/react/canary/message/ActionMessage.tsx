import * as React from 'react';
import { forwardRef } from 'react';
import cx from 'classnames';
import type { ClientMessageData, MessageContent } from '@cord-sdk/types';
import type { StyleProps } from '../../betaV2.js';
import withCord from '../../experimental/components/hoc/withCord.js';
import { useTranslatedMessageContent } from '../../hooks/useTranslatedMessageContent.js';
import { RenderNode } from '../../experimental/components/message/MessageText.js';
import { iconLarge } from '../../common/ui/atomicClasses/icons.css.js';
import { fontSmall } from '../../common/ui/atomicClasses/fonts.css.js';
import { MODIFIERS } from '../../common/ui/modifiers.js';
import { useViewerData } from '../../hooks/user.js';
import * as classes from './ActionMessage.css.js';
import * as messageClasses from './Message.css.js';

export type ActionMessageProps = {
  message: ClientMessageData;
} & StyleProps;

export const ActionMessage = withCord<
  React.PropsWithChildren<ActionMessageProps>
>(
  forwardRef(function ActionMessage(
    { message, className, style }: ActionMessageProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const content = useTranslatedMessageContent(
      message.translationKey,
      // [ONI]-TODO revisit type casting
      message.content as MessageContent,
    );

    const viewerData = useViewerData();

    return (
      <div
        className={cx(
          className,
          messageClasses.message,
          MODIFIERS.action,
          MODIFIERS.noReactions,
          {
            [MODIFIERS.deleted]: !!message.deletedTimestamp,
            [MODIFIERS.unseen]: !message.seen,
            [MODIFIERS.fromViewer]: viewerData?.id === message.authorID,
          },
        )}
        ref={ref}
        style={style}
        data-cord-message-id={message.id}
        data-cord-thread-id={message.threadID}
      >
        {message.iconURL && (
          <img
            className={cx(iconLarge, classes.actionMessageIcon)}
            src={message.iconURL}
            draggable={false}
          />
        )}
        <div className={cx(classes.actionMessageText, fontSmall)}>
          {content.map((node, index) => (
            <RenderNode
              key={index}
              node={node}
              message={message}
              index={index}
              formatStyle="action_message"
            />
          ))}
        </div>
      </div>
    );
  }),
  'ActionMessage',
);
