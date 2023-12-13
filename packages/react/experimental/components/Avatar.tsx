import * as React from 'react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import cx from 'classnames';

import type { ClientUserData, ViewerUserData } from '@cord-sdk/types';
import { MODIFIERS } from '../../common/ui/modifiers';
import { cordifyClassname, getStableColorPalette } from '../../common/util';
import classes from '../../components/Avatar.css';
import { WithTooltip, DefaultTooltip } from './WithTooltip';
import withCord from './hoc/withCord';
import { useCordTranslation } from '@cord-sdk/react';
import { useViewerData, useUserData } from '@cord-sdk/react/hooks/user';

export type AvatarReactComponentProps = {
  userId: string;
  enableTooltip?: boolean;
  className?: string;
  isAbsent?: boolean;
  Tooltip?: React.ComponentType<AvatarTooltipProps>;
};

export const Avatar = withCord<
  React.PropsWithChildren<AvatarReactComponentProps>
>(
  React.forwardRef(function Avatar(
    {
      Tooltip,
      userId,
      enableTooltip = false,
      className,
      isAbsent,
      ...restProps
    }: AvatarReactComponentProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const viewerData = useViewerData();
    const userAvatar = useUserData(userId);

    const tooltip = useMemo(() => {
      if (!userAvatar || !viewerData) {
        return null;
      }
      const TooltipComponent = Tooltip ?? AvatarTooltip;
      return <TooltipComponent userData={userAvatar} viewerData={viewerData} />;
    }, [userAvatar, viewerData, Tooltip]);

    if (!userAvatar) {
      return null;
    }
    return (
      <>
        {enableTooltip ? (
          <WithTooltip tooltip={tooltip} unstyled={!!Tooltip}>
            <AvatarInner
              ref={ref}
              user={userAvatar}
              className={className}
              isAbsent={isAbsent}
              {...restProps}
            />
          </WithTooltip>
        ) : (
          <AvatarInner
            ref={ref}
            user={userAvatar}
            className={className}
            isAbsent={isAbsent}
            {...restProps}
          />
        )}
      </>
    );
  }),
);

export type AvatarProps = {
  user: ClientUserData;
  isAbsent?: boolean;
};
type AvatarPropsWithClassname = AvatarProps & { className?: string };

const AvatarInner = forwardRef(function AvatarImpl(
  { user, isAbsent, className, ...restProps }: AvatarPropsWithClassname,
  ref: React.Ref<HTMLDivElement>,
) {
  const { displayName, name, id, profilePictureURL } = user;
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >(() => {
    if (!profilePictureURL) {
      return 'error';
    }
    return 'loading';
  });

  const mountedRef = useRef(false);
  useEffect(() => {
    // Run this effect when profile picture url changes but not on mount
    if (mountedRef.current) {
      setImageStatus('loading');
    } else {
      mountedRef.current = true;
    }
  }, [profilePictureURL]);

  const avatarPalette = useMemo(() => getStableColorPalette(id), [id]);

  return imageStatus !== 'error' ? (
    <div
      {...restProps}
      ref={ref}
      className={cx(classes.avatarContainer, className, {
        [MODIFIERS.present]: !isAbsent,
        [MODIFIERS.notPresent]: isAbsent,
        [MODIFIERS.loading]: imageStatus === 'loading',
      })}
      data-cy="cord-avatar"
      data-cord-user-id={id}
      data-cord-user-name={name}
    >
      <img
        className={classes.avatarImage}
        draggable={false}
        alt={displayName}
        onError={() => {
          setImageStatus('error');
        }}
        onLoad={() => setImageStatus('loaded')}
        src={profilePictureURL!}
      />
    </div>
  ) : (
    <div
      className={cx(
        classes.avatarContainer,
        className,
        [`${cordifyClassname('color-palette')}-${avatarPalette}`],
        {
          [MODIFIERS.present]: !isAbsent,
          [MODIFIERS.notPresent]: isAbsent,
        },
      )}
      {...restProps}
      ref={ref}
      data-cord-user-id={id}
      data-cord-user-name={name}
    >
      <AvatarFallback userData={user} />
    </div>
  );
});

export type AvatarFallbackProps = {
  userData: ClientUserData;
};

export function AvatarFallback({ userData: user }: AvatarFallbackProps) {
  const { displayName } = user;
  return (
    <div className={classes.avatarFallback}>{displayName[0].toUpperCase()}</div>
  );
}

export type AvatarTooltipProps = {
  viewerData: ViewerUserData;
  userData: ClientUserData;
};

export function AvatarTooltip({ viewerData, userData }: AvatarTooltipProps) {
  const { t } = useCordTranslation('user');
  return (
    <DefaultTooltip
      label={t(viewerData?.id === userData.id ? 'viewer_user' : 'other_user', {
        user: userData,
      })}
    />
  );
}
