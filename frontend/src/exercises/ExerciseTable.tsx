import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Exercise } from '~/types';
import { IconButton } from '~/ui';
import './ExerciseTable.scss';

export type ExerciseTableProps = {
  exercises: Exercise[];
  onDelete: (exercise: Exercise) => void;
  onUpdate: (exercise: Exercise) => void;
};

export const ExerciseTable = ({ exercises, onDelete, onUpdate }: ExerciseTableProps) => {
  return (
    <table className="ExerciseTable">
      <colgroup>
        <col />
        <col />
        <col />
        <col style={{ width: '100px' }} />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-left">Type</th>
          <th>Days Tracked</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise) => (
          <tr key={exercise.id}>
            <td>{exercise.name}</td>
            <td>
              <div className="text-capitalize">{exercise.value_type}</div>
            </td>
            <td className="text-center">{exercise.progress_count}</td>
            <td className="text-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <span className="material-symbols-outlined">more_vert</span>
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content">
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onUpdate(exercise)}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">edit</span>
                      </div>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onDelete(exercise)}>
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
