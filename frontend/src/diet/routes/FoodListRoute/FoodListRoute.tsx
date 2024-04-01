import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '~/components';
import { ListResponse, http } from '~/http';
import { Food } from '~/types';
import { Button, Container, IconButton, Input, RadixDialog } from '~/ui';
import { debounce } from '~/utils/debounce';
import { FoodForm, FoodFormData, FoodTable } from '../../components';
import './FoodListRoute.scss';

export const FoodListRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');
  const [totalFoods, setTotalFoods] = React.useState(0);
  const [hasPreviousPage, setHasPreviousPage] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [foodDialogInstance, setFoodDialogInstance] = React.useState<Food>();
  const [foodDialogOpen, setFoodDialogOpen] = React.useState(false);
  const [deleteFoodDialogOpen, setDeleteFoodDialogOpen] = React.useState(false);

  React.useEffect(() => {
    http
      .get<ListResponse<Food>>('/api/foods/', {
        params: searchParams,
      })
      .then((foods) => {
        setFoods(foods.data.results);
        setTotalFoods(foods.data.count);
        setHasPreviousPage(!!foods.data.previous);
        setHasNextPage(!!foods.data.next);
      });
  }, [searchParams]);

  const updateSearchParam = React.useCallback(
    debounce((name: string, value: string) => {
      if (name !== 'page') {
        searchParams.delete('page');
      }
      if (!value) {
        searchParams.delete(name);
      } else {
        searchParams.set(name, value);
      }
      setSearchParams(searchParams);
    }, 300),
    [searchParams, setSearchParams],
  );

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    updateSearchParam('search', e.target.value);
  }

  function getPage() {
    return parseInt(searchParams.get('page') || '1', 10);
  }

  function setPage(page: number) {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }

  function getTotalPages() {
    return Math.ceil(totalFoods / 20);
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
          {getTotalPages() > 1 && (
            <div className="flex justify-center my-8">
              <div className="Pagination">
                <IconButton disabled={!hasPreviousPage} onClick={() => setPage(getPage() - 1)}>
                  <span className="material-symbols-outlined">chevron_left</span>
                </IconButton>
                <p>
                  {getPage()} of {getTotalPages()}
                </p>
                <IconButton disabled={!hasNextPage} onClick={() => setPage(getPage() + 1)}>
                  <span className="material-symbols-outlined">chevron_right</span>
                </IconButton>
              </div>
            </div>
          )}
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
      <ConfirmDialog
        className="p-6"
        confirmLabel="Delete"
        danger
        message="Deleting this food will remove it from the database and all food log entries associated with it."
        onCancel={() => {
          setFoodDialogInstance(undefined);
          setDeleteFoodDialogOpen(false);
        }}
        onConfirm={confirmDeleteFood}
        onOpenChange={(open) => {
          if (!open) {
            setFoodDialogInstance(undefined);
          }
          setDeleteFoodDialogOpen(open);
        }}
        open={deleteFoodDialogOpen}
        style={{
          maxWidth: '480px',
        }}
        title="Delete Food"
      />
    </>
  );
};
