import React from 'react';
import {
  List,
  Create,
  Edit,
  SimpleForm,
  Datagrid,
  EmailField,
  TextField,
  TextInput,
  EditButton,
  DeleteButton,
} from 'react-admin';

export const UserList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <TextField source='email' />
        <TextField source='name' />
        <TextField source='role' />
        <EditButton basePath='/users' />
        <DeleteButton basePath='/users' />
      </Datagrid>
    </List>
  );
};

export const UserCreate = (props) => {
  return (
    <Create title='Create User' {...props}>
      <SimpleForm>
        <TextInput type='text' source='id' />
        <TextInput source='email' />
        <TextInput source='name' />
        <TextInput source='role' />
      </SimpleForm>
    </Create>
  );
};
export const UserEdit = (props) => {
  return (
    <Edit title='Edit User' {...props}>
      <SimpleForm>
        <TextInput disabled source='id' />
        <TextInput source='email' />
        <TextInput source='username' />
        <TextInput source='name' />
        <TextInput source='role' />
      </SimpleForm>
    </Edit>
  );
};
