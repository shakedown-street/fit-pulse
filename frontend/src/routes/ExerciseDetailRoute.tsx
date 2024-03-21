import React from 'react';
import { useParams } from 'react-router-dom';
import { PerformanceForm, PerformanceFormData, PerformanceTable } from '~/exercises';
import { ListResponse, http } from '~/http';
import { Exercise, Performance } from '~/types';
import { Button, Container, RadixDialog } from '~/ui';

export const ExerciseDetailRoute = () => {
  const [exercise, setExercise] = React.useState<Exercise>();
  const [performances, setPerformances] = React.useState<Performance[]>([]);
  const [deletePerformanceDialogOpen, setDeletePerformanceDialogOpen] = React.useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);
  const [performanceDialogInstance, setPerformanceDialogInstance] = React.useState<Performance | undefined>();

  const { id } = useParams();

  React.useEffect(() => {
    http.get<Exercise>(`/api/exercises/${id}`).then((exercise) => {
      setExercise(exercise.data);
    });
    http
      .get<ListResponse<Performance>>('/api/performances/', {
        params: {
          exercise: id,
        },
      })
      .then((performances) => {
        setPerformances(performances.data.results);
      });
  }, [id]);

  function submitPerformanceForm(data: PerformanceFormData, instance?: Performance) {
    if (instance) {
      http.patch<Performance>(`/api/performances/${instance.id}/`, data).then((performance) => {
        setPerformances((performances) =>
          performances.map((p) => (p.id === performance.data.id ? performance.data : p)),
        );
        setPerformanceDialogOpen(false);
      });
    } else {
      http.post<Performance>('/api/performances/', data).then((performance) => {
        setPerformances((performances) => [performance.data, ...performances]);
        setPerformanceDialogOpen(false);
      });
    }
  }

  function confirmDeletePerformance() {
    if (!performanceDialogInstance) {
      return;
    }
    http.delete(`/api/performances/${performanceDialogInstance.id}`).then(() => {
      setPerformances((performances) => performances.filter((p) => p.id !== performanceDialogInstance.id));
      setDeletePerformanceDialogOpen(false);
    });
  }

  if (!exercise) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Container>
        <div className="my-8 flex align-center justify-between gap-4">
          <h1>{exercise.name}</h1>
          <Button
            color="primary"
            onClick={() => {
              setPerformanceDialogInstance(undefined);
              setPerformanceDialogOpen(true);
            }}
            variant="ghost"
          >
            Create Performance
          </Button>
        </div>
        <h2 className="mb-4">Performance Log</h2>
        <PerformanceTable
          exercise={exercise}
          onDelete={(performance) => {
            setPerformanceDialogInstance(performance);
            setDeletePerformanceDialogOpen(true);
          }}
          onUpdate={(performance) => {
            setPerformanceDialogInstance(performance);
            setPerformanceDialogOpen(true);
          }}
          performances={performances}
        />
      </Container>
      <RadixDialog
        className="p-4"
        open={performanceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPerformanceDialogInstance(undefined);
          }
          setPerformanceDialogOpen(open);
        }}
        style={{
          width: '320px',
        }}
      >
        <h2 className="mb-2">{performanceDialogInstance ? 'Edit' : 'Create'} Performance</h2>
        <PerformanceForm exercise={exercise} instance={performanceDialogInstance} onSubmit={submitPerformanceForm} />
      </RadixDialog>
      <RadixDialog
        className="p-4"
        open={deletePerformanceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPerformanceDialogInstance(undefined);
          }
          setDeletePerformanceDialogOpen(open);
        }}
      >
        <h2 className="mb-2">Delete Performance</h2>
        <p>Are you sure you want to delete this performance?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              setPerformanceDialogInstance(undefined);
              setDeletePerformanceDialogOpen(false);
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button color="red" onClick={confirmDeletePerformance} variant="ghost">
            Delete
          </Button>
        </div>
      </RadixDialog>
    </>
  );
};
