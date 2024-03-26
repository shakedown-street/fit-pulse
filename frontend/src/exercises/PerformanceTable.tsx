import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Exercise, Performance } from '~/types';
import { IconButton } from '~/ui';
import { formatDateString } from '~/utils/dateString';
import './ExerciseTable.scss';

export type PerformanceTableProps = {
  exercise: Exercise;
  onDelete: (performance: Performance) => void;
  onUpdate: (performance: Performance) => void;
  performances: Performance[];
};

export const PerformanceTable = ({ exercise, onDelete, onUpdate, performances }: PerformanceTableProps) => {
  return (
    <table className="ExerciseTable">
      <colgroup>
        <col />
        {exercise.metrics.slice().map((_, idx) => {
          return <col key={idx} />;
        })}
        <col width={'100px'} />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Date</th>
          {exercise.metrics.map((metric) => {
            return (
              <th className="text-left" key={metric.id}>
                {metric.name}
              </th>
            );
          })}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {performances.map((performance) => {
          return (
            <tr key={performance.id}>
              <td>{formatDateString(performance.date, 'yyyy-MM-dd', 'MMM dd, yyyy')}</td>
              {performance.metrics.map((metric) => {
                return (
                  <td key={metric.id}>
                    <div className="flex align-center gap-2">
                      {metric.value}
                      {metric.improvement_percent > 0 && (
                        <span className="material-symbols-outlined text-green">trending_up</span>
                      )}
                      {metric.improvement_percent < 0 && (
                        <span className="material-symbols-outlined text-red">trending_down</span>
                      )}
                      {metric.improvement_percent === 0 && <span className="material-symbols-outlined">remove</span>}
                      {metric.improvement_percent !== 0 && <>{Math.abs(metric.improvement_percent).toFixed(2)}%</>}
                    </div>
                  </td>
                );
              })}
              <td className="text-center">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <IconButton>
                      <span className="material-symbols-outlined">more_vert</span>
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content align="end" className="DropdownMenu__content">
                      <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onUpdate(performance)}>
                        <div className="DropdownMenu__icon">
                          <span className="material-symbols-outlined">edit</span>
                        </div>
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onDelete(performance)}>
                        <div className="DropdownMenu__icon">
                          <span className="material-symbols-outlined">delete</span>
                        </div>
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
