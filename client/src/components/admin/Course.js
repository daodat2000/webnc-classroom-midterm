import React from 'react';
import {
  List,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
} from 'react-admin';

export const CourseList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <TextField source='name' />
        <TextField source='teacher' />
        <TextField source='description' />
        <TextField source='membership' />
        <EditButton basePath='/posts' />
        <DeleteButton basePath='/posts' />
      </Datagrid>
    </List>
  );
};

export const CourseCreate = (props) => {
  return (
    <Create title='Create a Course' {...props}>
      <SimpleForm>
        <TextInput type='text' source='id' />
        <TextInput source='name' />
        <TextInput source='teacher' />
        <TextInput source='description' />
        <TextInput source='membership' />
      </SimpleForm>
    </Create>
  );
};

export const CourseEdit = (props) => {
  return (
    <Edit title='Edit Course' {...props}>
      <SimpleForm>
        <TextInput disabled source='id' />
        <TextInput source='name' />
        <TextInput source='teacher' />
        <TextInput source='description' />
        <TextInput source='membership' />
      </SimpleForm>
    </Edit>
  );
};
