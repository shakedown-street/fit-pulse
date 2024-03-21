import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { format } from 'date-fns';
import { Exercise, Performance } from '~/types';
import { IconButton } from '~/ui';
import './ExerciseTable.scss';

export type PerformanceTableProps = {
  exercise: Exercise;
  onDelete: (performance: Performance) => void;
  onUpdate: (performance: Performance) => void;
  performances: Performance[];
};

export const PerformanceTable = ({ exercise, onDelete, onUpdate, performances }: PerformanceTableProps) => {
  function getImprovementPercent(performance: Performance) {
    // Get the percent of improvement from the previous performance
    // Return 0 if there is no previous performance

    const index = performances.findIndex((p) => p.id === performance.id);

    if (index === performances.length) {
      return 0;
    }

    const previous = performances[index + 1];

    if (!previous) {
      return 0;
    }

    const improvement = performance.value - previous.value;
    const percent = (improvement / previous.value) * 100;
    return percent;
  }

  return (
    <table className="ExerciseTable">
      <colgroup>
        <col />
        <col />
        <col />
        <col width={'100px'} />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Date</th>
          <th className="text-left text-capitalize">{exercise.value_type}</th>
          <th className="text-left">Improvement</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {performances.map((performance) => {
          const improvement = getImprovementPercent(performance);

          return (
            <tr key={performance.id}>
              <td>{format(new Date(performance.date), 'MMM dd, yyyy')}</td>
              <td>
                <div className="text-capitalize">{performance.value}</div>
              </td>
              <td>
                <div className="flex align-center gap-2">
                  {improvement > 0 && <span className="material-symbols-outlined text-green">trending_up</span>}
                  {improvement < 0 && <span className="material-symbols-outlined text-red">trending_down</span>}
                  {improvement === 0 && <span className="material-symbols-outlined">remove</span>}
                  {improvement !== 0 && <>{Math.abs(improvement).toFixed(2)}%</>}
                </div>
              </td>
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
