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
  const [profileState, setProfileState] = useState({
    _id: '',
    userId: '',
    about: '',
    gender: '',
    place: '',
    studentId: '',
    name: '',
  });
  const LoadProfile = async () => {
    try {
      const response = await axios.get(`${REACT_APP_SERVER_URL}/profile`);
      setProfileState(response.data);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  useEffect(() => {
    LoadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const myChangeHandler = (event) => {
    setProfileState({
      ...profileState,
      [event.target.name]: event.target.value,
    });
  };
  const submitAddClassForm = async () => {
    try {
      await axios.post(`${REACT_APP_SERVER_URL}/profile`, profileState);
      LoadProfile();
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
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
          name='name'
          onChange={myChangeHandler}
          value={profileState.name}
        />
        <Form.Field
          id='form-input-control-last-Email'
          control={Input}
          label='Email'
          placeholder='Email'
          name='email'
          onChange={myChangeHandler}
          value={profileState.email}
          disabled
        />
        <Form.Field
          id='form-input-control-last-Gender'
          control={Input}
          label='Gender'
          placeholder='Gender'
          name='gender'
          onChange={myChangeHandler}
          value={profileState.gender}
        />
      </Form.Group>
      <Form.Field
        id='form-input-control-first-StudentId'
        control={Input}
        label='StudentId'
        placeholder='StudentId'
        name='studentId'
        onChange={myChangeHandler}
        value={profileState.studentId}
      />
      <Form.Field
        id='form-input-control-first-Place'
        control={Input}
        label='Place'
        placeholder='Place'
        name='place'
        onChange={myChangeHandler}
        value={profileState.place}
      />

      <Form.Field
        id='form-textarea-control-About'
        control={TextArea}
        label='About'
        placeholder='About'
        name='about'
        onChange={myChangeHandler}
        value={profileState.about}
      />
      <Form.Field
        id='form-button-control-public'
        control={Button}
        content='Update'
        onClick={submitAddClassForm}
      />
    </Form>
  );
};
