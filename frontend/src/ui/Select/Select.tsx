import clsx from 'clsx';
import React from 'react';
import '../Input/Input.scss';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  fluid?: boolean;
  hint?: React.ReactNode;
  label?: string;
};

export const Select = React.forwardRef(
  ({ className, fluid, hint, id, label, ...rest }: SelectProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
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
        <select
          className={clsx('Input', {
            'Input--fluid': fluid,
          })}
          id={id}
          ref={ref}
          {...rest}
        />
        {hint && <p className="hint mt-2">{hint}</p>}
      </div>
    );
  },
);
