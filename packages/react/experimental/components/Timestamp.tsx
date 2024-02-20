import * as React from 'react';

import { forwardRef, useMemo } from 'react';
import cx from 'classnames';

// eslint-disable-next-line no-restricted-imports
import type { TFunction } from 'i18next';
import { timestamp } from '../../components/MessageTimestamp.css.js';
import { useCordTranslation } from '../../hooks/useCordTranslation.js';
import { fontSmallLight } from '../../common/ui/atomicClasses/fonts.css.js';
import { useTime } from '../../common/effects/useTime.js';
import {
  absoluteTimestampString,
  relativeTimestampString,
} from '../../common/util.js';
import { DefaultTooltip, WithTooltip } from './WithTooltip.js';
import withCord from './hoc/withCord.js';

export type TimestampProps = {
  // the string value is a date string with the format YYYY-MM-DDTHH:mm:ss.sssZ
  value?: string | number | Date;
  relative?: boolean;
  type: 'message' | 'notifications';
  className?: string;
};

export const Timestamp = withCord<React.PropsWithChildren<TimestampProps>>(
  forwardRef(function Timestamp(
    props: TimestampProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { type, value = new Date(), relative = true, className } = props;

    const { t: relativeT } = useCordTranslation(type, {
      keyPrefix: 'timestamp',
    });
    const { t: absoluteT } = useCordTranslation(type, {
      keyPrefix: 'absolute_timestamp',
    });
    const time = useTime();

    const date = useMemo(() => new Date(value), [value]);

    const absoluteTimestamp = useMemo(() => date.toLocaleString(), [date]);

    const displayString = useMemo(
      () =>
        relative
          ? relativeTimestampString(date, time, relativeT)
          : absoluteTimestampString(
              date,
              time,
              absoluteT as TFunction<'message', 'absolute_timestamp'>,
            ),
      [absoluteT, date, relative, relativeT, time],
    );

    return (
      <WithTooltip
        tooltip={<TimestampTooltip label={absoluteTimestamp} />}
        ref={ref}
      >
        <div className={cx(fontSmallLight, timestamp, className)}>
          {displayString}
        </div>
      </WithTooltip>
    );
  }),
  'Timestamp',
);

type TimestampTooltipProps = {
  label: string;
};

export const TimestampTooltip = ({ label }: TimestampTooltipProps) => {
  return <DefaultTooltip label={label} />;
};
