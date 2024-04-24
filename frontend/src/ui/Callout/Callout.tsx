import clsx from 'clsx';
import './Callout.scss';

export type CalloutColor =
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

export type CalloutProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: CalloutColor;
};

export const Callout = ({ children, className, color = 'gray', ...rest }: CalloutProps) => {
  return (
    <div
      className={clsx(
        'Callout',
        {
          [`Callout--color--${color}`]: color,
        },
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
