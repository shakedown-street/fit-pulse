import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListResponse, http } from '~/http';
import { Food } from '~/types';
import { Button, Container, Input, RadixDialog } from '~/ui';
import { debounce } from '~/utils/debounce';
import { FoodForm, FoodFormData, FoodTable } from '../../components';
import './FoodListRoute.scss';

export const FoodListRoute = () => {
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [foodDialogInstance, setFoodDialogInstance] = React.useState<Food>();
  const [foodDialogOpen, setFoodDialogOpen] = React.useState(false);
  const [deleteFoodDialogOpen, setDeleteFoodDialogOpen] = React.useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');

  React.useEffect(() => {
    http
      .get<ListResponse<Food>>('/api/foods/', {
        params: searchParams,
      })
      .then((foods) => {
        setFoods(foods.data.results);
      });
  }, [searchParams]);

  const updateSearchParam = React.useCallback(
    debounce((name: string, value: string) => {
      searchParams.set(name, value);
      setSearchParams(searchParams);
    }, 300),
    [searchParams, setSearchParams],
  );

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    updateSearchParam('search', e.target.value);
  }

  function submitFoodForm(data: FoodFormData, instance?: Food) {
    if (instance) {
      http.patch<Food>(`/api/foods/${instance.id}/`, data).then((food) => {
        setFoods((foods) => foods.map((f) => (f.id === food.data.id ? food.data : f)));
        setFoodDialogInstance(undefined);
        setFoodDialogOpen(false);
      });
    } else {
      http.post<Food>('/api/foods/', data).then((food) => {
        setFoods((foods) => [...foods, food.data]);
        setFoodDialogInstance(undefined);
        setFoodDialogOpen(false);
      });
    }
  }

  function confirmDeleteFood() {
    if (!foodDialogInstance) {
      return;
    }
    http.delete(`/api/foods/${foodDialogInstance.id}/`).then(() => {
      setFoods((foods) => foods.filter((f) => f.id !== foodDialogInstance.id));
      setFoodDialogInstance(undefined);
      setDeleteFoodDialogOpen(false);
    });
  }

  return (
    <>
      <div className="FoodListRoute">
        <Container>
          <div className="FoodListRoute__header">
            <h2>Food Database</h2>
            <Button
              color="primary"
              onClick={() => {
                setFoodDialogInstance(undefined);
                setFoodDialogOpen(true);
              }}
              variant="raised"
            >
              Create Food
            </Button>
          </div>
          <div className="FoodListRoute__filter">
            <Input onChange={handleSearchInputChange} placeholder="Search foods" value={searchInput} />
          </div>
          <FoodTable
            foods={foods}
            onDelete={(food) => {
              setFoodDialogInstance(food);
              setDeleteFoodDialogOpen(true);
            }}
            onUpdate={(food) => {
              setFoodDialogInstance(food);
              setFoodDialogOpen(true);
            }}
          />
        </Container>
      </div>
      <RadixDialog
        className="p-6"
        open={foodDialogOpen}
        onOpenChange={(open) => {
          setFoodDialogInstance(undefined);
          setFoodDialogOpen(open);
        }}
      >
        <h2 className="mb-2">{foodDialogInstance ? 'Edit' : 'Create'} Food</h2>
        <FoodForm instance={foodDialogInstance} onSubmit={submitFoodForm} />
      </RadixDialog>
      <RadixDialog
        className="p-6"
        open={deleteFoodDialogOpen}
        onOpenChange={(open) => {
          setFoodDialogInstance(undefined);
          setDeleteFoodDialogOpen(open);
        }}
        style={{
          maxWidth: '480px',
        }}
      >
        <h2 className="mb-2">Delete Food</h2>
        <h4 className="mb-2">{foodDialogInstance?.name}</h4>
        <p className="mb-2">
          Deleting this food will remove it from the database and all food log entries associated with it.
        </p>
        <p>This action cannot be undone!</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              setFoodDialogInstance(undefined);
              setDeleteFoodDialogOpen(false);
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
