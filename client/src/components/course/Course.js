import React, { useState, useEffect, createContext } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { Icon, Container, Modal, Button, Form } from 'semantic-ui-react';
import { CourseList } from './CourseList';

export const CourseContext = createContext();
const { REACT_APP_SERVER_URL } = process.env;

export const Course = () => {
  const [courseState, setCourseState] = useState([]);
  const [open, setOpen] = useState(false);
  let { path } = useRouteMatch();
  const [classForm, setClassForm] = useState({
    name: '',
    teacher: '',
    description: '',
    membership: '',
  });
  const myChangeHandler = (event) => {
    setClassForm({ ...classForm, [event.target.name]: event.target.value });
  };
  const LoadCourses = async () => {
    try {
      const response = await axios.get(`${REACT_APP_SERVER_URL}/course`);
      setCourseState(response.data.courses);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  const submitAddClassForm = async () => {
    console.log('add Course');
    try {
      await axios.post(`${REACT_APP_SERVER_URL}/course/add`, classForm);
      setOpen(false);
      await LoadCourses();
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    LoadCourses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const CourseContextData = { courseState };
  return (
    <CourseContext.Provider value={CourseContextData}>
      <Switch>
        <Route exact path={path}>
          <Container textAlign='right'>
            <Modal
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
              trigger={
                <Button basic>
                  <Icon name='add' />
                  Tạo mới Lớp
                </Button>
              }
            >
              <Modal.Header>Tạo mới Lớp</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Form>
                    <Form.Field>
                      <label>Tên Lớp học</label>
                      <input
                        placeholder='Tên Lớp học'
                        name='name'
                        onChange={myChangeHandler}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Tên Giáo Viên</label>
                      <input
                        placeholder='Tên Giáo Viên'
                        name='teacher'
                        onChange={myChangeHandler}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Mô tả</label>
                      <input
                        placeholder='Mô tả'
                        name='description'
                        onChange={myChangeHandler}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Số lượng tối đa</label>
                      <input
                        placeholder='Số lượng tối đa'
                        name='membership'
                        onChange={myChangeHandler}
                      />
                    </Form.Field>
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setOpen(false)}>Hủy</Button>
                <Button onClick={submitAddClassForm} positive>
                  Tạo
                </Button>
              </Modal.Actions>
            </Modal>
          </Container>
          <Container textAlign='justified'>
            <CourseList />
          </Container>
        </Route>
      </Switch>
    </CourseContext.Provider>
  );
};
