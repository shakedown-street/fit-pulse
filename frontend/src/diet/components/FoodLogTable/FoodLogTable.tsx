import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FoodLog } from '~/types';
import { IconButton } from '~/ui';
import './FoodLogTable.scss';

export type FoodLogTableProps = {
  foodLogs: FoodLog[];
  onDelete: (foodLog: FoodLog) => void;
  onUpdate: (foodLog: FoodLog) => void;
};

export const FoodLogTable = ({ foodLogs, onDelete, onUpdate }: FoodLogTableProps) => {
  return (
    <table className="FoodLogTable">
      <colgroup>
        <col />
        <col width="80px" />
        <col width="80px" />
        <col width="80px" />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Food</th>
          <th>Servings</th>
          <th>Calories</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {foodLogs.map((log) => (
          <tr key={log.id}>
            <td>
              <a className="cursor-pointer" onClick={() => onUpdate(log)}>
                {log.food.name}
              </a>
            </td>
            <td className="text-center">{log.servings}</td>
            <td className="text-center">{Math.floor(log.food.calories * log.servings)}</td>
            <td className="text-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <span className="material-symbols-outlined">more_vert</span>
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content">
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onUpdate(log)}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">edit</span>
                      </div>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onDelete(log)}>
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
