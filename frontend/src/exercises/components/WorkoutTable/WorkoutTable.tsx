import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { Workout } from '~/types';
import { IconButton } from '~/ui';
import './WorkoutTable.scss';

export type WorkoutTableProps = {
  workouts: Workout[];
  onDelete: (workout: Workout) => void;
  onUpdate: (workout: Workout) => void;
};

export const WorkoutTable = ({ workouts, onDelete, onUpdate }: WorkoutTableProps) => {
  const navigate = useNavigate();

  return (
    <table className="WorkoutTable">
      <colgroup>
        <col />
        <col width="80px" />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((workout) => (
          <tr key={workout.id}>
            <td>
              <a onClick={() => onUpdate(workout)}>{workout.name}</a>
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
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onUpdate(workout)}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">edit</span>
                      </div>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onDelete(workout)}>
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
        ))}
      </tbody>
    </table>
  );
};
