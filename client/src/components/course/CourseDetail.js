import React, { useEffect } from 'react';
import axios from 'axios';
import { CourseMember } from './CourseMember';
import { CourseNews } from './CourseNews';
import { CourseSettings } from './CourseSettings';
import { useState } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { CourseGrade } from './CourseGrade';
import {CourseGradeStructure} from './CourseGradeStructure';
const { REACT_APP_SERVER_URL } = process.env;
export const CourseDetail = (props) => {
  const [activeItem, setActiveItem] = useState('New Feeds');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [news,setNews] = useState([]);
  const [grades,setGrades] = useState([]);
  //using for course grade structure
  //const [gradeStructure,setGradeStructure] = useState([]);
  const submitStatus = async (content) => {
    console.log('add status');
    try {
      await axios.post(`${REACT_APP_SERVER_URL}/course/news`, {content:content, courseId:props.Course._id});
      LoadNews();
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
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
  const LoadNews = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/news/${props.Course._id}`
      );
      console.log(response.data.status)
      setNews(response.data.status)
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  const LoadGrades = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/grades/${props.Course._id}`
      );
      console.log("grades")
      console.log(response.data.grades)
      setGrades(response.data.grades)
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };



  useEffect(() => {
    LoadUsers();
  }, []);
  useEffect(() => {
    LoadNews();
  }, []);
  useEffect(() => {
    LoadGrades();
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
    content = <CourseNews News={news} onSubmit={submitStatus}></CourseNews>;
  } else if (activeItem === 'Settings') {
    content = <CourseSettings Course={props.Course}></CourseSettings>;
  } else if (activeItem == 'Grades'){
    content = <CourseGrade Grade={grades} ></CourseGrade>
  } else if (activeItem == 'Grade Structure'){
    //We need to load the grade structure, currently not implemented
    content = <CourseGradeStructure GradeStructure={props}></CourseGradeStructure>
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
              name='Grades'
              active={activeItem === 'Grades'}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='Grade Structure'
              active={activeItem === 'Grade Structure'}
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
