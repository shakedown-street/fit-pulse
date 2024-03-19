import { AxiosResponse } from 'axios';
import React from 'react';
import { http } from '~/http';
import { User } from './User';

export type LoginRequestData = {
  username: string;
  password: string;
};

export type AuthContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  getUser: () => Promise<AxiosResponse<User, any>>;
  login: (data: LoginRequestData) => Promise<AxiosResponse<User, any>>;
  logout: () => Promise<AxiosResponse<any, any>>;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = React.useState<User | undefined>();
  const [userLoading, setUserLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setUserLoading(true);
    getUser()
      .then((user) => setUser(user.data))
      .catch(() => setUser(undefined))
      .finally(() => setUserLoading(false));
  }, []);

  function getUser() {
    return http.get<User>('/api/session/');
  }

  function login(data: LoginRequestData) {
    return http.post<User>('/api/login/', data);
  }

  function logout() {
    return http.post('/api/logout/');
  }

  if (userLoading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        getUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
