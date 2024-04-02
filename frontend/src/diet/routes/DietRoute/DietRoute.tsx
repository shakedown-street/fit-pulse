import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '~/auth';
import { ConfirmDialog } from '~/components';
import { ListResponse, http } from '~/http';
import { FoodLog } from '~/types';
import { Button, Card, Container, Input, RadixDialog, TabItem, Tabs } from '~/ui';
import {
  DietForm,
  DietFormData,
  DietTargetCard,
  FoodLogForm,
  FoodLogFormData,
  FoodLogTable,
  MacroChart,
} from '../../components';
import './DietRoute.scss';

export const DietRoute = () => {
  const [selectedDate, setSelectedDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([]);
  const [dietDialogOpen, setDietDialogOpen] = React.useState(false);
  const [foodLogDialogInstance, setFoodLogDialogInstance] = React.useState<FoodLog>();
  const [foodLogDialogOpen, setFoodLogDialogOpen] = React.useState(false);
  const [deleteFoodLogDialogOpen, setDeleteFoodLogDialogOpen] = React.useState(false);
  const [selectedMealType, setSelectedMealType] = React.useState('all');

  const { user, patchUser } = useAuth();

  const mealLogs = foodLogs.filter((log) => {
    if (selectedMealType === 'all') {
      return true;
    } else {
      return log.meal_type === selectedMealType;
    }
  });

  const mealData = {
    calories: mealLogs.reduce((total, log) => total + log.food.calories * log.servings, 0),
    carbs: mealLogs.reduce((total, log) => total + log.food.carbs * log.servings, 0),
    proteins: mealLogs.reduce((total, log) => total + log.food.proteins * log.servings, 0),
    fats: mealLogs.reduce((total, log) => total + log.food.fats * log.servings, 0),
  };

  const macroTotals = mealLogs.reduce(
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
          <Tabs fluid>
            <TabItem active={selectedMealType === 'all'} onClick={() => setSelectedMealType('all')}>
              All
            </TabItem>
            <TabItem active={selectedMealType === 'breakfast'} onClick={() => setSelectedMealType('breakfast')}>
              Breakfast
            </TabItem>
            <TabItem active={selectedMealType === 'lunch'} onClick={() => setSelectedMealType('lunch')}>
              Lunch
            </TabItem>
            <TabItem active={selectedMealType === 'dinner'} onClick={() => setSelectedMealType('dinner')}>
              Dinner
            </TabItem>
            <TabItem active={selectedMealType === 'snack'} onClick={() => setSelectedMealType('snack')}>
              Snack
            </TabItem>
          </Tabs>
          <Card className="mb-8" radius="none" shadow="sm">
            {mealLogs.length === 0 ? (
              <div className="DietRoute__foodLog__empty">
                <p>No {selectedMealType !== 'all' && selectedMealType} food logs added yet.</p>
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
            ) : (
              <>
                <div className="DietRoute__meal__totals">
                  <p>
                    <strong>Calories:</strong> {mealData.calories}
                  </p>
                  <p>
                    <strong>Carbs:</strong> {mealData.carbs}g
                  </p>
                  <p>
                    <strong>Proteins:</strong> {mealData.proteins}g
                  </p>
                  <p>
                    <strong>Fats:</strong> {mealData.fats}g
                  </p>
                </div>
                <FoodLogTable
                  foodLogs={mealLogs}
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
                  {chartData.map((data, idx) => (
                    <div className="DietRoute__chart" key={idx}>
                      <h4 className="mb-4 text-capitalize">{data.name}</h4>
                      <MacroChart data={data} />
                      <p className="mt-4 text-size-xs">Consumed: {data.consumed}</p>
                      {selectedMealType === 'all' && (
                        <p className="text-size-xs">Remaining: {data.target - data.consumed}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
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
