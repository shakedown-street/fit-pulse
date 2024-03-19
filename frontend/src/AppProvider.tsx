import * as Tooltip from '@radix-ui/react-tooltip';
import { AuthProvider } from './auth';

export type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      <AuthProvider>
        <Tooltip.Provider>{children}</Tooltip.Provider>
      </AuthProvider>
    </>
  );
};
