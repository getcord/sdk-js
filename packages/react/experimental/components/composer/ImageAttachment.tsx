import * as React from 'react';
import cx from 'classnames';
import { DefaultTooltip, WithTooltip } from '../WithTooltip';
import * as classes from '@cord-sdk/react/components/composer/ImageAttachment.classnames';
import { useCordTranslation } from '@cord-sdk/react';
import { SpinnerIcon } from '@cord-sdk/react/common/icons/customIcons/SpinnerIcon';
import { Icon } from '@cord-sdk/react/components/helpers/Icon';

import { fontSmall } from '@cord-sdk/react/common/ui/atomicClasses/fonts.css';
import { MODIFIERS } from '@cord-sdk/react/common/ui/modifiers';

type Props = {
  onClick: () => unknown;
  uploading: boolean;
  url?: string;
  className?: string;
  onImageError?: () => unknown;
  tooltipLabel: string;
  onHoverElement?: JSX.Element;
  showErrorState?: boolean;
};

export function ImageAttachment({
  onClick,
  uploading,
  url,
  className,
  onImageError,
  tooltipLabel,
  onHoverElement,
  showErrorState,
}: Props) {
  const { t } = useCordTranslation('message');
  if (showErrorState) {
    return (
      <div className={cx(classes.imageAttachmentContainer, MODIFIERS.error)}>
        <Icon name="WarningCircle" size="large" color="content-primary" />
        <p className={cx(classes.errorMessage, fontSmall)}>
          {t('unable_to_display_image')}
        </p>
      </div>
    );
  }
  return (
    <WithTooltip tooltip={<ImageAttachmentTooltip label={tooltipLabel} />}>
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          onClick();
        }}
        className={cx(className, classes.imageAttachmentContainer, {
          [classes.loading]: uploading,
        })}
      >
        <img
          src={url}
          className={classes.imageAttachment}
          onError={onImageError}
        />
        <div className={classes.overlay}>
          <SpinnerIcon size="large" className={cx(classes.loadingIcon, {})} />
          {onHoverElement && (
            <div className={classes.onHoverElement}>{onHoverElement}</div>
          )}
        </div>
      </div>
    </WithTooltip>
  );
}

type ImageAttachmentTooltipProps = {
  label: string;
};
function ImageAttachmentTooltip({ label }: ImageAttachmentTooltipProps) {
  return <DefaultTooltip label={label} />;
}
