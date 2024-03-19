import clsx from 'clsx';
import React from 'react';
import './Card.scss';

export type CardRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type CardShadow = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  fluid?: boolean;
  radius?: CardRadius;
  shadow?: CardShadow;
};

export const Card = React.forwardRef(
  ({ className, fluid, radius = 'md', shadow = 'sm', ...rest }: CardProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        className={clsx(
          'Card',
          {
            'Card--fluid': fluid,
            [`radius-${radius}`]: radius,
            [`shadow-${shadow}`]: shadow,
          },
          className,
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);
