import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '~/ui';
import { SignUpRequest, useAuth } from '../../context';
import './SignUpForm.scss';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const signUpForm = useForm<SignUpRequest>();
  const { signUp } = useAuth();

  function onSubmit(data: SignUpRequest) {
    signUp(data)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        if (error.response?.data.username) {
          signUpForm.setError('username', { message: error.response.data.username[0] });
        } else if (error.response?.data.email) {
          signUpForm.setError('email', { message: error.response.data.email[0] });
        } else if (error.response?.data.non_field_errors) {
          signUpForm.setError('root', {
            message: error.response.data.non_field_errors[0],
          });
        } else {
          signUpForm.setError('root', {
            message: 'An unknown error occurred',
          });
        }
        signUpForm.resetField('password1');
        signUpForm.resetField('password2');
      });
  }

  return (
    <form className="SignUpForm" onSubmit={signUpForm.handleSubmit(onSubmit)}>
      <Input
        fluid
        id="username"
        invalid={!!signUpForm.formState.errors.username}
        label="Username"
        {...signUpForm.register('username', { required: true })}
      />
      {signUpForm.formState.errors.username && <p className="error">{signUpForm.formState.errors.username.message}</p>}
      <Input
        fluid
        id="email"
        invalid={!!signUpForm.formState.errors.email}
        label="Email"
        type="email"
        {...signUpForm.register('email', { required: true })}
      />
      {signUpForm.formState.errors.email && <p className="error">{signUpForm.formState.errors.email.message}</p>}
      <Input
        fluid
        id="password1"
        label="Password"
        {...signUpForm.register('password1', { required: true })}
        type="password"
      />
      <Input
        fluid
        id="password2"
        label="Password (again)"
        {...signUpForm.register('password2', { required: true })}
        type="password"
      />
      {signUpForm.formState.errors.root && <p className="error">{signUpForm.formState.errors.root.message}</p>}
      <Button color="primary" disabled={!signUpForm.formState.isValid} fluid type="submit" variant="raised">
        Sign Up
      </Button>
    </form>
  );
};
