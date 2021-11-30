import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
export const CourseSettings = (props) => {
  console.log(props.Course);
  const [classForm, setClassForm] = useState({
    name: props.Course.name,
    teacher: props.Course.teacher,
    description: props.Course.description,
    membership: props.Course.membership,
  });

  console.log(window.location.origin);
  const myChangeHandler = (event) => {
    setClassForm({ ...classForm, [event.target.name]: event.target.value });
  };
  return (
    <div className='shopping-list'>
      <h1>Settings </h1>
      <Message>
        <Message.Header>Invitation link</Message.Header>
        <p>
          {window.location.origin}/course/join/{props.Course._id}
        </p>
      </Message>

      <h3>Class details</h3>
      <Form>
        <Form.Field>
          <label>Tên Lớp học</label>
          <input
            placeholder='Tên Lớp học'
            name='name'
            onChange={myChangeHandler}
            value={classForm.name}
          />
        </Form.Field>
        <Form.Field>
          <label>Tên Giáo Viên</label>
          <input
            placeholder='Tên Giáo Viên'
            name='teacher'
            onChange={myChangeHandler}
            value={classForm.teacher}
          />
        </Form.Field>
        <Form.Field>
          <label>Mô tả</label>
          <input
            placeholder='Mô tả'
            name='description'
            onChange={myChangeHandler}
            value={classForm.description}
          />
        </Form.Field>
        <Form.Field>
          <label>Số lượng tối đa</label>
          <input
            placeholder='Số lượng tối đa'
            name='membership'
            onChange={myChangeHandler}
            value={classForm.membership}
          />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
};
