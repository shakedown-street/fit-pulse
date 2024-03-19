import clsx from 'clsx';
import React from 'react';
import './Button.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fluid?: boolean;
};

export const Button = React.forwardRef(
  ({ className, fluid, type = 'button', ...rest }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return (
      <button
        className={clsx(
          'Button',
          {
            'Button--fluid': fluid,
          },
          className,
        )}
        ref={ref}
        type={type}
        {...rest}
      />
    );
  },
);
