import React, { useEffect } from 'react';
import axios from 'axios';
import { CourseMember } from './CourseMember';
import { CourseNews } from './CourseNews';
import { CourseSettings } from './CourseSettings';
import { useState } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';

const { REACT_APP_SERVER_URL } = process.env;
export const CourseDetail = (props) => {
  const [activeItem, setActiveItem] = useState('New Feeds');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const LoadUsers = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/members/${props.Course._id}`
      );
      setStudents(response.data.students);
      setTeachers(response.data.teachers);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  useEffect(() => {
    LoadUsers();
  }, []);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  let content;
  if (activeItem === 'Members') {
    content = (
      <CourseMember
        Students={students}
        Teachers={teachers}
        CourseId={props.Course._id}
      ></CourseMember>
    );
  } else if (activeItem === 'New Feeds') {
    content = <CourseNews></CourseNews>;
  } else if (activeItem === 'Settings') {
    content = <CourseSettings Course={props.Course}></CourseSettings>;
  }
  return (
    <>
      <br />
      <Grid container>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular pointing color='blue'>
            <Menu.Item
              name='New Feeds'
              active={activeItem === 'New Feeds'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='Members'
              active={activeItem === 'Members'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='Settings'
              active={activeItem === 'Settings'}
              onClick={handleItemClick}
            />
          </Menu>
        </Grid.Column>
        <Grid.Column stretched width={12}>
          <Segment>{content}</Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};
