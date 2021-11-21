import React, { useContext, useState } from 'react';
import {
  Menu,
  Segment,
  Button,
  Icon,
  Dropdown,
  Container,
  Input,
} from 'semantic-ui-react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const MenuUI = ({ children }) => {
  const {
    logoutUser,
    authState: { authLoading, isAuthenticated, user },
  } = useContext(AuthContext);
  let url = useLocation().pathname;
  if (url == '/') {
    url = '/home';
  }
  const [itemState, setItemState] = useState({
    activeItem: url && url.split('/')[1],
  });
  const Logout = () => logoutUser();
  const handleItemClick = (e, { name }) => setItemState({ activeItem: name });

  const { activeItem } = itemState;
  const options = [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{!isAuthenticated ? null : user.name}</strong>
        </span>
      ),
      as: Link,
      to: `/account`,
      value: 1,
    },
    {
      key: 'profile',
      text: 'Your Profile',
      as: Link,
      to: `/account`,
      value: 2,
    },
    { key: 'stars', text: 'Your Stars', value: 3 },
    { key: 'explore', text: 'Explore', value: 4 },
    { key: 'integrations', text: 'Integrations', value: 5 },
    { key: 'help', text: 'Help', value: 6 },
    { key: 'settings', text: 'Settings', value: 7 },
    { key: 'sign-out', text: 'Sign Out', value: 8, onClick: Logout },
  ];
  return (
    <div>
      <Segment inverted>
        <Menu inverted pointing secondary stackable>
          <Container>
            <Menu.Item
              name='home'
              active={activeItem === 'home'}
              onClick={handleItemClick}
              as={Link}
              to='/'
            >
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item
              name='course'
              active={activeItem === 'course'}
              onClick={handleItemClick}
              as={Link}
              to='/course'
            />

            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' placeholder='Search...' />
              </Menu.Item>
              {authLoading ? null : !isAuthenticated ? (
                <>
                  <Menu.Item>
                    <Button as={Link} to='/register' inverted>
                      Sign up
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button as={Link} to='/login' inverted>
                      Log-in
                    </Button>
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Dropdown
                    trigger={
                      <span>
                        <Icon name='user' /> Hello, {user.name}
                      </span>
                    }
                    options={options}
                    className='link item'
                  />
                </>
              )}
            </Menu.Menu>
          </Container>
        </Menu>
      </Segment>
      {children}
    </div>
  );
};

export default MenuUI;
