import * as React from 'react';
import cx from 'classnames';
import { forwardRef } from 'react';
import withCord from '../../experimental/components/hoc/withCord.js';
import * as buttonClasses from '../../components/helpers/Button.classnames.js';
import type { GeneralButtonProps } from '../../experimental.js';
import { Button } from '../../experimental.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { useToast } from '../../experimental/hooks/useToast.js';

export type ReopenThreadButtonProps = {
  onClick: () => void;
} & Omit<GeneralButtonProps, 'buttonAction' | 'ref'>;

export const ReopenThreadButton = withCord<
  React.PropsWithChildren<ReopenThreadButtonProps>
>(
  forwardRef(function ReopenThreadButton(
    { onClick, className, ...restProps }: ReopenThreadButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) {
    const { t } = useCordTranslation('composer');
    const { t: threadT } = useCordTranslation('thread');
    const { showToastPopup } = useToast();

    return (
      <Button
        className={cx(
          className,
          buttonClasses.colorsPrimary,
          buttonClasses.medium,
        )}
        canBeReplaced
        onClick={() => {
          onClick();
          showToastPopup?.(threadT('resolve_action_success'));
        }}
        {...restProps}
        buttonAction="composer-reopen-thread"
        ref={ref}
      >
        {t('unresolve_action')}
      </Button>
    );
  }),
  'ReopenThreadButton',
);
