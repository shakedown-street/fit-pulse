import React from 'react';
import { Outlet } from 'react-router-dom';
import './AppLayout.scss';
import { Nav } from './components';
import { IconButton, RadixDialog, RadixTooltip } from './ui';
import { PerformanceForm, PerformanceFormData } from './exercises';
import { http } from './http';

export const AppLayout = () => {
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);

  function submitPerformanceForm(data: PerformanceFormData) {
    http.post<Performance>('/api/performances/', data).then((performance) => {
      setPerformanceDialogOpen(false);
    });
  }

  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <RadixTooltip
        side="left"
        sideOffset={8}
        trigger={
          <IconButton
            className="main__fab"
            color="primary"
            onClick={() => setPerformanceDialogOpen(true)}
            size="xl"
            variant="ghost"
          >
            <span className="material-symbols-outlined">add</span>
          </IconButton>
        }
      >
        Create Performance
      </RadixTooltip>
      <RadixDialog
        className="p-4"
        open={performanceDialogOpen}
        onOpenChange={setPerformanceDialogOpen}
        style={{
          width: '320px',
        }}
      >
        <h2 className="mb-2">Create Performance</h2>
        <PerformanceForm onSubmit={submitPerformanceForm} />
      </RadixDialog>
    </>
  );
};
