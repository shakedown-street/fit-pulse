import clsx from 'clsx';
import React from 'react';
import './Button.scss';

export type ButtonColor =
  | 'primary'
  | 'gray'
  | 'red'
  | 'pink'
  | 'grape'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'text' | 'outlined' | 'ghost' | 'raised';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  fluid?: boolean;
  rounded?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef(
  (
    { className, color = 'gray', fluid, rounded, size = 'md', type = 'button', variant = 'text', ...rest }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        className={clsx(
          'Button',
          {
            'Button--fluid': fluid,
            'Button--rounded': rounded,
            [`Button--color--${color}`]: color,
            [`Button--size--${size}`]: size,
            [`Button--variant--${variant}`]: variant,
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
