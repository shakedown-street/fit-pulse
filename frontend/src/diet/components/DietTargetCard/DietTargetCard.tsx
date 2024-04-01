import { User } from '~/types';
import { Card, IconButton } from '~/ui';
import './DietTargetCard.scss';

export type DietTargetCardProps = {
  onUpdate: () => void;
  user: User;
};

export const DietTargetCard = ({ onUpdate, user }: DietTargetCardProps) => {
  return (
    <Card className="DietTargetCard" shadow="none">
      <div className="DietTargetCard__header">
        <h3>Diet</h3>
        <IconButton onClick={onUpdate}>
          <span className="material-symbols-outlined">edit</span>
        </IconButton>
      </div>
      <hr />
      <p>
        <b>Calories:</b> {user?.diet.calories}
      </p>
      <p>
        <b>Carbs:</b> {user?.diet.carbs}g
      </p>
      <p>
        <b>Proteins:</b> {user?.diet.proteins}g
      </p>
      <p>
        <b>Fats:</b> {user?.diet.fats}g
      </p>
    </Card>
  );
};
