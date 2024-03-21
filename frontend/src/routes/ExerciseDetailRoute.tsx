import React from 'react';
import { useParams } from 'react-router-dom';
import { PerformanceTable } from '~/exercises';
import { ListResponse, http } from '~/http';
import { Exercise, Performance } from '~/types';
import { Container } from '~/ui';

export const ExerciseDetailRoute = () => {
  const [exercise, setExercise] = React.useState<Exercise>();
  const [performances, setPerformances] = React.useState<Performance[]>([]);

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

  if (!exercise) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Container>
        <h1>{exercise.name}</h1>
        <h2>All Performances</h2>
        <PerformanceTable exercise={exercise} performances={performances} />
      </Container>
    </>
  );
};
