import clsx from 'clsx';
import './TabItem.scss';

export type TabItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export const TabItem = ({ active, className, ...rest }: TabItemProps) => {
  return (
    <button
      className={clsx('TabItem', {
        'TabItem--active': active,
      })}
      {...rest}
    />
  );
};
