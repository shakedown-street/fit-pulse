import { useForm } from 'react-hook-form';
import { Button, Input } from '~/ui';
import { useAuth } from '../../context';
import './ProfileForm.scss';

export type ProfileFormData = {
  first_name: string;
  last_name: string;
};

export const ProfileForm = () => {
  const { user, patchUser } = useAuth();
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  });

  function onSubmit(data: ProfileFormData) {
    patchUser(data)
      .then(() => {})
      .catch((error) => {
        if (error.response?.data.first_name) {
          profileForm.setError('first_name', { message: error.response.data.first_name[0] });
        } else if (error.response?.data.last_name) {
          profileForm.setError('last_name', { message: error.response.data.last_name[0] });
        } else {
          profileForm.setError('root', {
            message: 'An unknown error occurred',
          });
        }
      });
  }

  return (
    <form className="ProfileForm" onSubmit={profileForm.handleSubmit(onSubmit)}>
      <Input fluid id="email" label="Email" readOnly value={user?.email} />
      <Input
        fluid
        id="first_name"
        invalid={!!profileForm.formState.errors.first_name}
        label="First name"
        {...profileForm.register('first_name', { required: true })}
      />
      {profileForm.formState.errors.first_name && (
        <p className="error">{profileForm.formState.errors.first_name.message}</p>
      )}
      <Input
        fluid
        id="last_name"
        invalid={!!profileForm.formState.errors.last_name}
        label="Last name"
        {...profileForm.register('last_name', { required: true })}
      />
      {profileForm.formState.errors.last_name && (
        <p className="error">{profileForm.formState.errors.last_name.message}</p>
      )}
      {profileForm.formState.errors.root && <p className="error">{profileForm.formState.errors.root.message}</p>}
      <Button color="primary" disabled={!profileForm.formState.isValid} fluid type="submit" variant="raised">
        Save
      </Button>
    </form>
  );
};
