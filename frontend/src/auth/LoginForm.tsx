import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '~/ui';
import { useAuth } from './AuthContext';
import './LoginForm.scss';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginForm = useForm({
    mode: 'onBlur',
  });
  const { login, setUser } = useAuth();

  const onSubmit = (data: any) => {
    login(data)
      .then((user) => {
        setUser(user.data);
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.non_field_errors) {
          loginForm.setError('root.serverError', {
            message: error.response.data.non_field_errors[0],
          });
        } else {
          loginForm.setError('root.serverError', {
            message: 'An unknown error occurred',
          });
        }
        loginForm.resetField('password');
      });
  };

  return (
    <form className="LoginForm" onSubmit={loginForm.handleSubmit(onSubmit)}>
      <Input fluid id="username" label="Username" {...loginForm.register('username', { required: true })} />
      <Input
        fluid
        id="password"
        label="Password"
        {...loginForm.register('password', { required: true })}
        type="password"
      />
      {loginForm.formState.errors.root?.serverError && (
        <p className="error">{loginForm.formState.errors.root.serverError.message}</p>
      )}
      <Button disabled={!loginForm.formState.isValid} fluid type="submit">
        Login
      </Button>
    </form>
  );
};
