import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  TextArea,
  Button,
  Select,
  Header,
} from 'semantic-ui-react';

export const Profile = () => {
  const { REACT_APP_SERVER_URL } = process.env;
  const [profileState, setProfileState] = useState();
  const genderOptions = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
    { key: 'o', text: 'Other', value: 'other' },
  ];
  const LoadProfile = async () => {
    try {
      const response = await axios.get(`${REACT_APP_SERVER_URL}/profile`);
      response.data.name = 'abc';
      console.log(response.data);
      setProfileState(response.data);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  useEffect(() => {
    LoadProfile(profileState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  console.log();
  return (
    <Form>
      <Header as='h1' dividing>
        Profile
      </Header>
      <Form.Group widths='equal'>
        <Form.Field
          id='form-input-control-first-Name'
          control={Input}
          label='Name'
          placeholder='Name'
        />
        <Form.Field
          id='form-input-control-last-Place'
          control={Input}
          label='Email'
          placeholder='Email'
        />
        <Form.Field
          control={Select}
          options={genderOptions}
          label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
          placeholder='Gender'
          search
          searchInput={{ id: 'form-select-control-gender' }}
        />
      </Form.Group>
      <Form.Field
        id='form-input-control-first-StudentId'
        control={Input}
        label='StudentId'
        placeholder='StudentId'
      />
      <Form.Field
        id='form-input-control-first-Place'
        control={Input}
        label='Place'
        placeholder='Place'
      />

      <Form.Field
        id='form-textarea-control-About'
        control={TextArea}
        label='About'
        placeholder='About'
      />
      <Form.Field
        id='form-button-control-public'
        control={Button}
        content='Update'
      />
    </Form>
  );
};
