import clsx from 'clsx';
import './Tabs.scss';

export type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  fluid?: boolean;
};

export const Tabs = ({ className, fluid, ...rest }: TabsProps) => {
  return (
    <div
      className={clsx(
        'Tabs',
        {
          'Tabs--fluid': fluid,
        },
        className,
      )}
      {...rest}
    />
  );
};
