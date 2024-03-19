import clsx from 'clsx';
import React from 'react';
import './Input.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  fluid?: boolean;
  label?: string;
};

export const Input = React.forwardRef(
  ({ className, fluid, id, label, ...rest }: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
      <div
        className={clsx('Input__container', {
          'Input__container--fluid': fluid,
        })}
      >
        {label && (
          <label className="Input__label" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          className={clsx(
            'Input',
            {
              'Input--fluid': fluid,
            },
            className,
          )}
          id={id}
          ref={ref}
          {...rest}
        />
      </div>
    );
  },
);
