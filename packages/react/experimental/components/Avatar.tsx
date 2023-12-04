// @ts-ignore TS wants us to `import type` this, but we need it for JSX
import * as React from 'react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import cx from 'classnames';

import type { ClientUserData } from '@cord-sdk/types';
import { cordifyClassname, getStableColorPalette } from '../../common/util';
import classes from '../../components/Avatar.css';
import { MODIFIERS } from '../../common/ui/modifiers';
import { WithTooltip } from './WithTooltip';
import withCord from './hoc/withCord';
import { useCordTranslation, user } from '@cord-sdk/react';

export type AvatarReactComponentProps = {
  userId: string;
  enableTooltip?: boolean;
  className?: string;
  isAbsent?: boolean;
};

export const Avatar = withCord<
  React.PropsWithChildren<AvatarReactComponentProps>
>(
  React.forwardRef(function Avatar(
    {
      userId,
      enableTooltip = false,
      className,
      isAbsent,
      ...restProps
    }: AvatarReactComponentProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { t } = useCordTranslation('user');
    const viewerData = user.useViewerData();
    const userAvatar = user.useUserData(userId);

    if (!userAvatar) {
      return null;
    }

    return (
      <>
        {enableTooltip ? (
          <WithTooltip
            label={t(
              viewerData?.id === userAvatar.id ? 'viewer_user' : 'other_user',
              {
                user: userAvatar,
              },
            )}
          >
            <AvatarInner
              ref={ref}
              user={userAvatar}
              className={cx('cord-component', className)}
              isAbsent={isAbsent}
              {...restProps}
            />
          </WithTooltip>
        ) : (
          <AvatarInner
            ref={ref}
            user={userAvatar}
            className={cx('cord-component', className)}
            isAbsent={isAbsent}
            {...restProps}
          />
        )}
      </>
    );
  }),
  'avatar',
);

export type AvatarProps = {
  user: ClientUserData;
  isAbsent?: boolean;
};
type AvatarPropsWithClassname = AvatarProps & { className?: string };

const AvatarInner = forwardRef(function AvatarImpl(
  {
    user: { displayName, name, id, profilePictureURL },
    isAbsent,
    className,
    ...restProps
  }: AvatarPropsWithClassname,
  ref: React.Ref<HTMLDivElement>,
) {
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
      <div className={classes.avatarFallback}>
        {displayName[0].toUpperCase()}
      </div>
    </div>
  );
});
