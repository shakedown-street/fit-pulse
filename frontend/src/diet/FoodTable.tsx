import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Food } from '~/types';
import './FoodTable.scss';
import { IconButton } from '~/ui';

export type FoodTableProps = {
  foods: Food[];
  onDelete: (food: Food) => void;
  onUpdate: (food: Food) => void;
};

export const FoodTable = ({ foods, onDelete, onUpdate }: FoodTableProps) => {
  return (
    <table className="FoodTable">
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
        <col width="100px" />
      </colgroup>
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-left">Calories</th>
          <th className="text-left">Carbs</th>
          <th className="text-left">Proteins</th>
          <th className="text-left">Fats</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {foods.map((food) => (
          <tr key={food.id}>
            <td>
              <a className="cursor-pointer" onClick={() => onUpdate(food)}>
                {food.name}
              </a>
            </td>
            <td>{food.calories}</td>
            <td>{food.carbs}g</td>
            <td>{food.proteins}g</td>
            <td>{food.fats}g</td>
            <td className="text-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton>
                    <span className="material-symbols-outlined">more_vert</span>
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="DropdownMenu__content">
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onUpdate(food)}>
                      <div className="DropdownMenu__icon">
                        <span className="material-symbols-outlined">edit</span>
                      </div>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenu__item" onClick={() => onDelete(food)}>
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
