import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { Exercise } from '~/types';
import { IconButton } from '~/ui';
import './ExerciseTable.scss';

export type ExerciseTableProps = {
  exercises: Exercise[];
  onCreatePerformance: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
  onUpdate: (exercise: Exercise) => void;
};

export const ExerciseTable = ({ exercises, onDelete, onCreatePerformance, onUpdate }: ExerciseTableProps) => {
  const navigate = useNavigate();

  return (
    <table className="ExerciseTable">
      <colgroup>
        <col />
        <col width="175px" />
        <col width="80px" />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-left">Metrics</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise) => (
          <tr key={exercise.id}>
            <td>
              <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
            </td>
            <td>{exercise.metrics.map((metric) => metric.name).join(', ')}</td>
            <td className="text-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <span className="material-symbols-outlined">more_vert</span>
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content">
                    <DropdownMenu.Item
                      className="DropdownMenu__item"
                      onClick={() => navigate(`/exercises/${exercise.id}`)}
                    >
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">visibility</span>
                      </div>
                      View
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onUpdate(exercise)}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">edit</span>
                      </div>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onCreatePerformance(exercise)}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">monitoring</span>
                      </div>
                      Log Performance
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
