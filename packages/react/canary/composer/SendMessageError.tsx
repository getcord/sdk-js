import React, { forwardRef } from 'react';
import cx from 'classnames';

import withCord from '../../experimental/components/hoc/withCord.js';
import type { StyleProps } from '../../experimental.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import * as classes from '../../components/Composer.classnames.js';

export type SendMessageErrorProps = StyleProps;

export const SendMessageError = withCord<
  React.PropsWithChildren<SendMessageErrorProps>
>(
  forwardRef(function SendMessageError(
    { className, ...restProps }: SendMessageErrorProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('composer');

    return (
      <div
        ref={ref}
        className={cx(className, classes.composerErrorMessage)}
        {...restProps}
      >
        {t('send_message_action_failure')}
      </div>
    );
  }),
  'SendMessageError',
);
