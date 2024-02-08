import * as React from 'react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import cx from 'classnames';

import type { ClientUserData, ViewerUserData } from '@cord-sdk/types';
import { MODIFIERS } from '../../common/ui/modifiers.ts';
import { cordifyClassname, getStableColorPalette } from '../../common/util.ts';
import classes from '../../components/Avatar.css.ts';
import { useCordTranslation } from '../../index.ts';
import { useViewerData, useUserData } from '../../hooks/user.ts';
import { WithTooltip, DefaultTooltip } from './WithTooltip.tsx';
import withCord from './hoc/withCord.tsx';

export type AvatarProps = {
  userId: string;
  enableTooltip?: boolean;
  className?: string;
  isAbsent?: boolean;
};

export const Avatar = withCord<React.PropsWithChildren<AvatarProps>>(
  React.forwardRef(function Avatar(
    {
      userId,
      enableTooltip = false,
      className,
      isAbsent,
      ...restProps
    }: AvatarProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const viewerData = useViewerData();
    const userAvatar = useUserData(userId);
    const tooltip = useMemo(() => {
      if (!userAvatar || !viewerData) {
        return null;
      }
      return (
        <AvatarTooltip
          userData={userAvatar}
          viewerData={viewerData}
          canBeReplaced
        />
      );
    }, [userAvatar, viewerData]);

    if (!userAvatar) {
      return null;
    }
    return (
      <>
        {enableTooltip ? (
          <WithTooltip tooltip={tooltip}>
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
  'Avatar',
);

export type AvatarInnerProps = {
  user: ClientUserData;
  isAbsent?: boolean;
};
type AvatarPropsWithClassname = AvatarInnerProps & { className?: string };

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
      <AvatarFallback userData={user} canBeReplaced />
    </div>
  );
});

export type AvatarFallbackProps = {
  userData: ClientUserData;
};

export const AvatarFallback = withCord<
  React.PropsWithChildren<AvatarFallbackProps>
>(
  forwardRef(function AvatarFallback(
    { userData: user }: AvatarFallbackProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { displayName } = user;
    return (
      <div ref={ref} className={classes.avatarFallback}>
        {displayName[0].toUpperCase()}
      </div>
    );
  }),
  'AvatarFallback',
);

export type AvatarTooltipProps = {
  viewerData: ViewerUserData;
  userData: ClientUserData;
};

export const AvatarTooltip = withCord<
  React.PropsWithChildren<AvatarTooltipProps>
>(
  forwardRef(function AvatarTooltip(
    { viewerData, userData, ...restProps }: AvatarTooltipProps,
    _ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('user');
    if (!userData || !viewerData) {
      return null;
    }
    return (
      <DefaultTooltip
        label={t(
          viewerData?.id === userData.id ? 'viewer_user' : 'other_user',
          {
            user: userData,
          },
        )}
        {...restProps}
      />
    );
  }),
  'AvatarTooltip',
);
