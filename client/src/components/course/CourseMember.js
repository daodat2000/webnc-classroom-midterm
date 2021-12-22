import React, { useState,useEffect } from 'react';
import { Button, List, Form } from 'semantic-ui-react';
import { Icon, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { CSVLink } from 'react-csv';

export const CourseMember = ({ Students, Teachers, CourseId }) => {
  console.log(Teachers);
  console.log(Students);
  const [open, setOpen] = useState(false);
  const [fileName, setfileName] = useState("");
  const [csvStudentList, setCsvStudentList] = useState(null);
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
  const downloadStudentList = async () => {

    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/course/downloadStudentList`,
        {
          students: Students,
          fileName: fileName
        }
      );
      setfileName("");
      setOpen(false);
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const upoadStudentList = async () => {

    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/course/uploadStudentList`,
        {
          fileName: fileName,
          courseId: CourseId
        }
      );
      setfileName("");
      setOpen(false);
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  useEffect(() => {
    ExportStudentList();
  }, []);
  const ExportStudentList = async () => {
  
    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/course/downloadStudentList`,
        {
          students: Students,
        }
      );
      setfileName("");
      setOpen(false);
      console.log(response.data);

      setCsvStudentList({
        data: response.data.data,
        headers: response.data.headers,
        filename: 'studentList.csv',
      });

    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
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
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button basic>
            <Icon name='add' />
            Download/Upload
          </Button>
        }
      >
        <Modal.Header>Download</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Tên file:</label>
                <input
                  placeholder='filename1'
                  name='filename1'
                  onChange={(event) => setfileName(event.target.value)}
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={downloadStudentList} positive>
            Download
          </Button>
          <Button onClick={upoadStudentList} positive>
            Upload
          </Button>
        </Modal.Actions>
      </Modal>
      {csvStudentList !== null ? (
        <CSVLink {...csvStudentList}>Export to CSV</CSVLink>
      ) : (
        ''
      )}




     
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
