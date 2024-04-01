import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~/auth';
import { ConfirmDialog } from '~/components';
import { ListResponse, http } from '~/http';
import { FoodLog } from '~/types';
import { Button, Container, Input, RadixDialog } from '~/ui';
import {
  DietForm,
  DietFormData,
  DietTargetCard,
  FoodLogForm,
  FoodLogFormData,
  FoodLogTable,
  MacroChart,
  MacroTotalsCard,
} from '../../components';
import './DietRoute.scss';

export const DietRoute = () => {
  const [selectedDate, setSelectedDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([]);
  const [dietDialogOpen, setDietDialogOpen] = React.useState(false);
  const [foodLogDialogInstance, setFoodLogDialogInstance] = React.useState<FoodLog>();
  const [foodLogDialogOpen, setFoodLogDialogOpen] = React.useState(false);
  const [deleteFoodLogDialogOpen, setDeleteFoodLogDialogOpen] = React.useState(false);

  const { user, patchUser } = useAuth();

  const macroTotals = foodLogs.reduce(
    (totals, log) => ({
      calories: totals.calories + Math.floor(log.food.calories * log.servings),
      carbs: totals.carbs + Math.floor(log.food.carbs * log.servings),
      proteins: totals.proteins + Math.floor(log.food.proteins * log.servings),
      fats: totals.fats + Math.floor(log.food.fats * log.servings),
    }),
    { calories: 0, carbs: 0, proteins: 0, fats: 0 },
  );

  const chartData = ['calories', 'carbs', 'proteins', 'fats'].map((nutrient) => ({
    name: nutrient,
    consumed: macroTotals[nutrient as keyof typeof macroTotals],
    target: user?.diet[nutrient as keyof typeof macroTotals] || 0,
  }));

  React.useEffect(() => {
    http
      .get<ListResponse<FoodLog>>('/api/food-logs/', {
        params: {
          date: selectedDate,
        },
      })
      .then((foodLogs) => {
        setFoodLogs(foodLogs.data.results);
      });
  }, [selectedDate]);

  function submitDietForm(data: DietFormData) {
    patchUser(data as any).then(() => {
      setDietDialogOpen(false);
    });
  }

  function submitFoodLogForm(data: FoodLogFormData, instance?: FoodLog) {
    const { food, ...rest } = data;

    const payload = {
      food: food.id,
      ...rest,
    };

    if (instance) {
      http.patch<FoodLog>(`/api/food-logs/${instance.id}/`, payload).then((foodLog) => {
        setFoodLogs(foodLogs.map((log) => (log.id === foodLog.data.id ? foodLog.data : log)));
        setFoodLogDialogInstance(undefined);
        setFoodLogDialogOpen(false);
      });
    } else {
      http.post<FoodLog>('/api/food-logs/', payload).then((foodLog) => {
        setFoodLogs([...foodLogs, foodLog.data]);
        setFoodLogDialogInstance(undefined);
        setFoodLogDialogOpen(false);
      });
    }
  }

  function confirmDeleteFood() {
    if (!foodLogDialogInstance) {
      return;
    }
    http.delete(`/api/food-logs/${foodLogDialogInstance.id}/`).then(() => {
      setFoodLogs(foodLogs.filter((log) => log.id !== foodLogDialogInstance.id));
      setFoodLogDialogInstance(undefined);
      setDeleteFoodLogDialogOpen(false);
    });
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="DietRoute">
        <Container>
          <div className="DietRoute__header">
            <DietTargetCard onUpdate={() => setDietDialogOpen(true)} user={user} />
            <Link to="/diet/foods">
              <Button color="primary" variant="raised">
                Food Database
              </Button>
            </Link>
          </div>
          <div className="DietRoute__foodLog">
            <div className="DietRoute__foodLog__header">
              <h3>Food Log</h3>
              <Input onChange={(e) => setSelectedDate(e.target.value)} type="date" value={selectedDate} />
            </div>
            <Button
              color="primary"
              onClick={() => {
                setFoodLogDialogInstance(undefined);
                setFoodLogDialogOpen(true);
              }}
              variant="raised"
            >
              Add Food Log
            </Button>
          </div>
          <FoodLogTable
            foodLogs={foodLogs}
            onDelete={(foodLog) => {
              setFoodLogDialogInstance(foodLog);
              setDeleteFoodLogDialogOpen(true);
            }}
            onUpdate={(foodLog) => {
              setFoodLogDialogInstance(foodLog);
              setFoodLogDialogOpen(true);
            }}
          />
          <div className="DietRoute__macroCharts">
            <MacroTotalsCard macroTotals={macroTotals} />
            {chartData.map((data, idx) => (
              <div key={idx}>
                <h4 className="text-center text-capitalize mb-2">{data.name}</h4>
                <MacroChart data={data} />
                <div className="text-center mt-2">
                  <p className="text-size-xs">Consumed: {data.consumed}</p>
                  <p className="text-size-xs">Remaining: {data.target - data.consumed}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <RadixDialog className="p-6" open={dietDialogOpen} onOpenChange={setDietDialogOpen}>
        <h2 className="mb-2">Edit Diet</h2>
        <DietForm instance={user.diet} onSubmit={submitDietForm} />
      </RadixDialog>
      <RadixDialog
        className="p-6"
        open={foodLogDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFoodLogDialogInstance(undefined);
          }
          setFoodLogDialogOpen(open);
        }}
      >
        <h2 className="mb-2">{foodLogDialogInstance ? 'Edit' : 'Add'} Food Log</h2>
        <FoodLogForm instance={foodLogDialogInstance} readOnlyDate={selectedDate} onSubmit={submitFoodLogForm} />
      </RadixDialog>
      <ConfirmDialog
        className="p-6"
        confirmLabel="Delete"
        danger
        message="Are you sure you want to delete this food log?"
        onCancel={() => {
          setFoodLogDialogInstance(undefined);
          setDeleteFoodLogDialogOpen(false);
        }}
        onConfirm={confirmDeleteFood}
        onOpenChange={(open) => {
          if (!open) {
            setFoodLogDialogInstance(undefined);
          }
          setDeleteFoodLogDialogOpen(open);
        }}
        open={deleteFoodLogDialogOpen}
        style={{
          maxWidth: '480px',
        }}
        title="Delete Food Log"
      />
    </>
  );
};
