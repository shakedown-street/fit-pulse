import React from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmDialog } from '~/components';
import { ListResponse, http } from '~/http';
import { Exercise, Performance } from '~/types';
import { Button, Container, RadixDialog } from '~/ui';
import { PerformanceChart, PerformanceForm, PerformanceFormData, PerformanceTable } from '../../components';
import './ExerciseDetailRoute.scss';

export const ExerciseDetailRoute = () => {
  const [exercise, setExercise] = React.useState<Exercise>();
  const [performances, setPerformances] = React.useState<Performance[]>([]);
  const [deletePerformanceDialogOpen, setDeletePerformanceDialogOpen] = React.useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);
  const [performanceDialogInstance, setPerformanceDialogInstance] = React.useState<Performance | undefined>();

  const { id } = useParams();

  React.useEffect(() => {
    http.get<Exercise>(`/api/exercises/${id}/`).then((exercise) => {
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
    const { metrics, ...rest } = data;

    const metricsData = Object.entries(data.metrics).map(([key, value]) => ({
      metric: key,
      value,
    }));

    const payload = {
      ...rest,
      metrics: metricsData,
    };

    if (instance) {
      http.patch<Performance>(`/api/performances/${instance.id}/`, payload).then((performance) => {
        setPerformances((performances) =>
          performances.map((p) => (p.id === performance.data.id ? performance.data : p)),
        );
        setPerformanceDialogOpen(false);
      });
    } else {
      http.post<Performance>('/api/performances/', payload).then((performance) => {
        setPerformances((performances) => [performance.data, ...performances]);
        setPerformanceDialogOpen(false);
      });
    }
  }

  function confirmDeletePerformance() {
    if (!performanceDialogInstance) {
      return;
    }
    http.delete(`/api/performances/${performanceDialogInstance.id}/`).then(() => {
      setPerformances((performances) => performances.filter((p) => p.id !== performanceDialogInstance.id));
      setDeletePerformanceDialogOpen(false);
    });
  }

  if (!exercise) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="ExerciseDetailRoute">
        <Container>
          <div className="ExerciseDetailRoute__header">
            <h2>{exercise.name}</h2>
            <Button
              color="primary"
              onClick={() => {
                setPerformanceDialogInstance(undefined);
                setPerformanceDialogOpen(true);
              }}
              variant="raised"
            >
              Log Performance
            </Button>
          </div>
          <PerformanceChart performances={performances} />
          <h3 className="my-8">Performance Log</h3>
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
      </div>
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
        <h2 className="mb-2">{performanceDialogInstance ? 'Edit' : 'Log'} Performance</h2>
        <PerformanceForm exercise={exercise} instance={performanceDialogInstance} onSubmit={submitPerformanceForm} />
      </RadixDialog>
      <ConfirmDialog
        className="p-6"
        confirmLabel="Delete"
        danger
        message="Are you sure you want to delete this performance?"
        onCancel={() => {
          setPerformanceDialogInstance(undefined);
          setDeletePerformanceDialogOpen(false);
        }}
        onConfirm={confirmDeletePerformance}
        open={deletePerformanceDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPerformanceDialogInstance(undefined);
          }
          setDeletePerformanceDialogOpen(open);
        }}
        title="Delete Performance"
      />
    </>
  );
};
