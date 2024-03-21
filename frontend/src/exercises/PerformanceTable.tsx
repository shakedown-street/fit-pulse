import { Exercise, Performance } from '~/types';
import './ExerciseTable.scss';

export type PerformanceTableProps = {
  exercise: Exercise;
  performances: Performance[];
};

export const PerformanceTable = ({ exercise, performances }: PerformanceTableProps) => {
  function getImprovementPercent(performance: Performance) {
    // Get the percent of improvement from the previous performance to this performance
    // Return 0 if there is no previous performance

    const index = performances.findIndex((p) => p.id === performance.id);

    if (index === performances.length) {
      return 0;
    }

    const previous = performances[index + 1];

    if (!previous) {
      return 0;
    }

    const improvement = performance.value - previous.value;
    const percent = (improvement / previous.value) * 100;
    return percent;
  }

  return (
    <table className="ExerciseTable">
      <thead>
        <tr>
          <th className="text-left">Date</th>
          <th className="text-left text-capitalize">{exercise.value_type}</th>
          <th className="text-left">Improvement</th>
        </tr>
      </thead>
      <tbody>
        {performances.map((performance) => {
          const improvement = getImprovementPercent(performance);

          return (
            <tr key={performance.id}>
              <td>{performance.date}</td>
              <td>
                <div className="text-capitalize">{performance.value}</div>
              </td>
              <td>
                <div className="flex align-center gap-2">
                  {improvement > 0 && <span className="material-symbols-outlined text-green">trending_up</span>}
                  {improvement < 0 && <span className="material-symbols-outlined text-red">trending_down</span>}
                  {improvement === 0 && <span className="material-symbols-outlined">remove</span>}
                  {improvement !== 0 && <>{Math.abs(improvement).toFixed(2)}%</>}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
