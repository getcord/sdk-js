// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import { useEffect, useState, forwardRef } from 'react';
import type { Placement } from '@floating-ui/react-dom';
import { Slot } from '@radix-ui/react-slot';
import cx from 'classnames';

import { usePopperCreator } from '../../hooks/usePopperCreator';
import type { PopperPosition } from '../../types';
import * as classes from '../../components/Tooltip.css';
import { Portal } from '@cord-sdk/react/experimental/components/Portal';
import { useComposedRefs } from '@cord-sdk/react/common/lib/composeRefs';
import { fontSmallLight } from '@cord-sdk/react/common/ui/atomicClasses/fonts.css';

const DEFAULT_POSITION: PopperPosition = 'top';
const DEFAULT_OFFSET = 2;

export type TooltipProps = {
  label: string | null;
  subtitle?: string;
};

type WithTooltipProps = TooltipProps &
  React.PropsWithChildren<{
    popperPosition?: PopperPosition;
    offset?: number | ((placement: Placement) => number);
    tooltipDisabled?: boolean;
    onHover?: () => void;
    className?: string;
  }>;

export const WithTooltip = forwardRef(function WithTooltip(
  {
    label,
    subtitle,
    popperPosition = DEFAULT_POSITION,
    offset = DEFAULT_OFFSET,
    tooltipDisabled = false,
    onHover,
    children,
    className,
    ...otherProps
  }: WithTooltipProps,
  ref: React.ForwardedRef<unknown>,
) {
  const [hover, setHover] = useState<boolean>(false);

  const {
    styles: popperStyles,
    setReferenceElement,
    setPopperElement,
  } = usePopperCreator({
    popperPosition,
    offset,
  });

  useEffect(() => {
    if (tooltipDisabled) {
      setHover(false);
    }
  }, [tooltipDisabled]);

  const setRef = useComposedRefs(ref, setReferenceElement);

  if (tooltipDisabled) {
    return <Slot className={className}>{children}</Slot>;
  }

  return (
    <>
      <Slot
        ref={setRef}
        {...otherProps}
        onMouseEnter={() => {
          setHover(true);
          onHover?.();
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {children}
      </Slot>
      {label && hover && (
        <Portal>
          <div
            ref={setPopperElement}
            style={popperStyles}
            className={cx(classes.tooltip, fontSmallLight)}
          >
            <p className={classes.tooltipLabel}>{label}</p>
            {subtitle && <p className={classes.tooltipSubtitle}>{subtitle}</p>}
          </div>
        </Portal>
      )}
    </>
  );
});
