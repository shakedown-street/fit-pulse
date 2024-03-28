import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { useAuth } from '~/auth';
import { ListResponse, http } from '~/http';
import { FoodLog } from '~/types';
import { Button, Card, Container, IconButton, Input, RadixDialog } from '~/ui';
import { DietForm, DietFormData, FoodLogForm, FoodLogFormData, FoodLogTable } from '../../components';
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
    consumed: macroTotals[nutrient],
    target: user?.diet[nutrient],
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
            <Card className="DietRoute__targets" shadow="none">
              <div className="DietRoute__targets__header">
                <h3>Diet</h3>
                <IconButton onClick={() => setDietDialogOpen(true)}>
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
            <Link to="/diet/foods">
              <Button color="primary" variant="raised">
                Food Database
              </Button>
            </Link>
          </div>
          <div className="DietRoute__foodLog">
            <div className="DietRoute__foodLog__header">
              <h3>Food Log</h3>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
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
            {chartData.map((data, idx) => (
              <div key={idx}>
                <h4 className="text-center text-capitalize mb-4">{data.name}</h4>
                <PieChart width={100} height={100} key={data.name}>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: 'Consumed', value: data.consumed },
                      { name: 'Remaining', value: Math.max(0, data.target - data.consumed) },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                  >
                    <Cell fill="#5f3dc4" />
                    <Cell fill="#212529" />
                  </Pie>
                  <Tooltip />
                </PieChart>
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
      <RadixDialog
        className="p-6"
        open={deleteFoodLogDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFoodLogDialogInstance(undefined);
          }
          setDeleteFoodLogDialogOpen(open);
        }}
        style={{
          maxWidth: '480px',
        }}
      >
        <h2 className="mb-2">Delete Food Log</h2>
        <p>Are you sure you want to delete this food log?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              setFoodLogDialogInstance(undefined);
              setDeleteFoodLogDialogOpen(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button color="red" onClick={confirmDeleteFood} variant="raised">
            Delete
          </Button>
        </div>
      </RadixDialog>
    </>
  );
};
