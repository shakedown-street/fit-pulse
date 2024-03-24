import clsx from 'clsx';
import React from 'react';
import './Input.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  fluid?: boolean;
  hint?: React.ReactNode;
  invalid?: boolean;
  label?: string;
};

export const Input = React.forwardRef(
  ({ className, fluid, hint, id, invalid, label, ...rest }: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
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
              'Input--invalid': invalid,
            },
            className,
          )}
          id={id}
          ref={ref}
          {...rest}
        />
        {hint && <p className="hint mt-2">{hint}</p>}
      </div>
    );
  },
);
