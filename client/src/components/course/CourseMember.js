import React, { useState } from 'react';
import { Button, List, Form } from 'semantic-ui-react';
import axios from 'axios';

export const CourseMember = ({ Students, Teachers, CourseId }) => {
  console.log(Teachers);

  const { REACT_APP_SERVER_URL } = process.env;

  const [emailState, setEmailState] = useState('');

  const myChangeHandler = (event) => {
    setEmailState(event.target.value);
  };
  var Invitemember = async (role) => {
    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/course/invite`,
        {
          courseId: CourseId,
          email: emailState,
          role: role,
        }
      );
      setEmailState('');
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
    }
  };
  return (
    <div>
      <Form>
        <Form.Input
          icon='user'
          iconPosition='left'
          placeholder='Invite By E-mail'
          type='email'
          name='email'
          onChange={myChangeHandler}
          value={emailState}
        />

        <Button
          content='Invite Teacher'
          primary
          onClick={() => Invitemember('teacher')}
        />
        <Button
          content='Invite Student'
          onClick={() => Invitemember('student')}
        />
      </Form>
      <h1>Teachers</h1>
      <List>
        {Teachers.map((teacher, i) => (
          <List.Item key={i}>
            <List.Icon name='user' />
            <List.Content>{teacher.name}</List.Content>
          </List.Item>
        ))}
      </List>
      <h1>Students</h1>
      <List>
        {Students.map((student, i) => (
          <List.Item key={i}>
            <List.Icon name='student' />
            <List.Content>{student.name}</List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};
