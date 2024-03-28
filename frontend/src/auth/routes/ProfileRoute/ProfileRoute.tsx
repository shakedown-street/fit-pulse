import React from 'react';
import { Card, Container, TabItem, Tabs } from '~/ui';
import { PasswordChangeForm, ProfileForm } from '../../components';

export const ProfileRoute = () => {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'password'>('profile');

  return (
    <>
      <Container>
        <div className="centerPage">
          <Card className="p-0" fluid>
            <Tabs fluid>
              <TabItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                Profile
              </TabItem>
              <TabItem active={activeTab === 'password'} onClick={() => setActiveTab('password')}>
                Password
              </TabItem>
            </Tabs>
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
