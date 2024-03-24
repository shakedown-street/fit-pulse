import clsx from 'clsx';
import React from 'react';
import { User } from '~/types';
import './Avatar.scss';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize;
  user: User;
};

export const Avatar = React.forwardRef(
  ({ size = 'md', user, ...rest }: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    function getName() {
      if (user.full_name) {
        return user.full_name;
      } else {
        return user.username;
      }
    }

    function getInitials() {
      return getName()
        .split(' ')
        .map((name) => name[0])
        .join('');
    }

    return (
      <div
        className={clsx('Avatar', {
          [`Avatar--size--${size}`]: size,
        })}
        ref={ref}
        {...rest}
      >
        {user.image && <img className="Avatar__image" src={user.image} alt={getName()} />}
        {!user.image && <div className="Avatar__fallback">{getInitials()}</div>}
      </div>
    );
  },
);
