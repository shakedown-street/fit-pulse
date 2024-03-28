import { AxiosResponse } from 'axios';
import React from 'react';
import { http } from '~/http';
import { User } from '~/types';

export type SignUpRequest = {
  username: string;
  email: string;
  password1: string;
  password2: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type PasswordChangeRequest = {
  current_password: string;
  new_password1: string;
  new_password2: string;
};

export type AuthContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  getSession: () => Promise<AxiosResponse<User, any>>;
  patchUser: (data: Partial<User>) => Promise<AxiosResponse<User, any>>;
  signUp: (data: SignUpRequest) => Promise<AxiosResponse<User, any>>;
  login: (data: LoginRequest) => Promise<AxiosResponse<User, any>>;
  logout: () => Promise<AxiosResponse<any, any>>;
  passwordChange: (data: PasswordChangeRequest) => Promise<AxiosResponse<any, any>>;
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
    getSession()
      .then((user) => setUser(user.data))
      .catch(() => setUser(undefined))
      .finally(() => setUserLoading(false));
  }, []);

  function getSession() {
    return http.get<User>('/api/session/');
  }

  function patchUser(data: Partial<User>) {
    if (!user) {
      throw new Error('User is undefined');
    }
    return http.patch<User>(`/api/users/${user.id}/`, data).then((user) => {
      setUser(user.data);
      return user;
    });
  }

  function signUp(data: SignUpRequest) {
    return http.post<User>('/api/users/', data);
  }

  function login(data: LoginRequest) {
    return http.post<User>('/api/login/', data);
  }

  function logout() {
    return http.post('/api/logout/');
  }

  function passwordChange(data: PasswordChangeRequest) {
    return http.post('/api/password-change/', data);
  }

  if (userLoading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        getSession,
        patchUser,
        signUp,
        login,
        logout,
        passwordChange,
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
