import React, { useState } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { Profile } from './Profile';

export const Account = () => {
  const [activeItem, setActiveItem] = useState('Profile');

  const handleItemClick = (e, { name }) => setActiveItem(name);
  let content;
  if (activeItem === 'Profile') {
    content = <Profile></Profile>;
  } else if (activeItem === 'Setting') {
    content = <Profile></Profile>;
  }
  return (
    <>
      <br />
      <Grid container>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular pointing color='blue'>
            <Menu.Item
              name='Profile'
              active={activeItem === 'Profile'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='Setting'
              active={activeItem === 'Setting'}
              onClick={handleItemClick}
            />
          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment>{content}</Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};
