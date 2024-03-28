import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '~/ui';
import { LoginRequest, useAuth } from '../../context';
import './LoginForm.scss';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginForm = useForm<LoginRequest>();
  const { login, setUser } = useAuth();

  function onSubmit(data: LoginRequest) {
    login(data)
      .then((user) => {
        setUser(user.data);
        navigate('/');
      })
      .catch((error) => {
        if (error.response?.data.non_field_errors) {
          loginForm.setError('root', {
            message: error.response.data.non_field_errors[0],
          });
        } else {
          loginForm.setError('root', {
            message: 'An unknown error occurred',
          });
        }
        loginForm.resetField('password');
      });
  }

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
      {loginForm.formState.errors.root && <p className="error">{loginForm.formState.errors.root.message}</p>}
      <Button color="primary" disabled={!loginForm.formState.isValid} fluid type="submit" variant="raised">
        Login
      </Button>
    </form>
  );
};
