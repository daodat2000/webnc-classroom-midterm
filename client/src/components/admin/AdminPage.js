import React, { useContext } from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import { CourseList, CourseCreate, CourseEdit } from './Course';
import { UserList, UserEdit, UserCreate } from './User';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
const fetchJson = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // add your own headers here
  options.headers.set('X-Custom-Header', 'foobar');
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = restProvider('http://localhost:5000/api', fetchJson);
console.log(dataProvider);

export const AdminPage = () => {
  const {
    authState: { user },
  } = useContext(AuthContext);
  if (user.role != 'admin') return <Redirect to='/login' />;
  else {
    return (
      <Admin dataProvider={dataProvider}>
        <Resource
          name='courses'
          list={CourseList}
          create={CourseCreate}
          edit={CourseEdit}
        />
        <Resource
          name='users'
          list={UserList}
          create={UserCreate}
          edit={UserEdit}
        />
      </Admin>
    );
  }
};
