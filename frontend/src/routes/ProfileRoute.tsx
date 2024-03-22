import clsx from 'clsx';
import React from 'react';
import { PasswordChangeForm, ProfileForm } from '~/auth';
import { Card, Container } from '~/ui';
import './ProfileRoute.scss';

export const ProfileRoute = () => {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'password'>('profile');

  return (
    <>
      <Container>
        <div className="centerPage">
          <Card className="p-0" fluid>
            <div className="Tabs">
              <button
                className={clsx('TabItem', {
                  'TabItem--active': activeTab === 'profile',
                })}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={clsx('TabItem', {
                  'TabItem--active': activeTab === 'password',
                })}
                onClick={() => setActiveTab('password')}
              >
                Password
              </button>
            </div>
            <div className="p-6">
              {activeTab === 'profile' && <ProfileForm />}
              {activeTab === 'password' && <PasswordChangeForm />}
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
};
