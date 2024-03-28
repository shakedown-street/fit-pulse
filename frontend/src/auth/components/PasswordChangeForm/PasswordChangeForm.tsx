import { useForm } from 'react-hook-form';
import { Button, Input } from '~/ui';
import { PasswordChangeRequest, useAuth } from '../../context';
import './PasswordChangeForm.scss';

export const PasswordChangeForm = () => {
  const passwordChangeForm = useForm<PasswordChangeRequest>();
  const { passwordChange } = useAuth();

  function onSubmit(data: PasswordChangeRequest) {
    passwordChange(data)
      .then(() => {})
      .catch((error) => {
        if (error.response?.data.current_password) {
          passwordChangeForm.setError('current_password', { message: error.response.data.current_password[0] });
        } else if (error.response?.data.non_field_errors) {
          passwordChangeForm.setError('root', {
            message: error.response.data.non_field_errors[0],
          });
        } else {
          passwordChangeForm.setError('root', {
            message: 'An unknown error occurred',
          });
        }
      });
  }

  return (
    <form className="PasswordChangeForm" onSubmit={passwordChangeForm.handleSubmit(onSubmit)}>
      <Input
        fluid
        id="current_password"
        invalid={!!passwordChangeForm.formState.errors.current_password}
        label="Current password"
        {...passwordChangeForm.register('current_password', { required: true })}
        type="password"
      />
      {passwordChangeForm.formState.errors.current_password && (
        <p className="error">{passwordChangeForm.formState.errors.current_password.message}</p>
      )}
      <Input
        fluid
        id="new_password1"
        label="New password"
        {...passwordChangeForm.register('new_password1', { required: true })}
        type="password"
      />
      <Input
        fluid
        id="new_password2"
        label="New password (again)"
        {...passwordChangeForm.register('new_password2', { required: true })}
        type="password"
      />
      {passwordChangeForm.formState.errors.root && (
        <p className="error">{passwordChangeForm.formState.errors.root.message}</p>
      )}
      <Button color="primary" disabled={!passwordChangeForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
