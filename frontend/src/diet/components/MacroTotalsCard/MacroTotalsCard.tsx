import { Card } from '~/ui';
import './MacroTotalsCard.scss';

export type MacroTotalsCardProps = {
  macroTotals: {
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
  };
};

export const MacroTotalsCard = ({ macroTotals }: MacroTotalsCardProps) => {
  return (
    <Card className="MacroTotalsCard" shadow="none">
      <div className="MacroTotalsCard__header">
        <h3>Total</h3>
      </div>
      <hr />
      <p>
        <b>Calories:</b> {macroTotals.calories}
      </p>
      <p>
        <b>Carbs:</b> {macroTotals.carbs}g
      </p>
      <p>
        <b>Proteins:</b> {macroTotals.proteins}g
      </p>
      <p>
        <b>Fats:</b> {macroTotals.fats}g
      </p>
    </Card>
  );
};
