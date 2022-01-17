import React, { useEffect } from 'react';
import axios from 'axios';
import { CourseMember } from './CourseMember';
import { CourseNews } from './CourseNews';
import { CourseSettings } from './CourseSettings';
import { useState } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { CourseGrade } from './CourseGrade';
import { CourseGradeStructure } from './CourseGradeStructure';
import { CourseGradeStudent } from './CourseGradeStudent';
import { CourseNotifications} from './CourseNotifications';
const { REACT_APP_SERVER_URL } = process.env;
export const CourseDetail = (props) => {
  const [activeItem, setActiveItem] = useState('New Feeds');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [news, setNews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isRoleTeacher,setIsRoleTeacher] = useState(false);

  const submitStatus = async (content) => {
    console.log('add status');
    try {
      await axios.post(`${REACT_APP_SERVER_URL}/course/news`, {
        content: content,
        courseId: props.Course._id,
      });
      LoadNews();
      //update notification 
      await axios.post(`${REACT_APP_SERVER_URL}/course/notifications`, {
        content: "đă đăng một bình luận trong khoá học của bạn", //fix thanh da cong bo diem "exam"... khi cong bo diem
        courseId: props.Course._id,
      });
      LoadNotifications();
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
      console.log('Load News');
      console.log(response.data.status);
      setNews(response.data.status);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  const LoadNotifications= async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/notifications/${props.Course._id}`
      );
      console.log('Load Notification');
      // console.log(response.data.notification);
      // console.log(response.data.notification);
      setNotifications(response.data.notification);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  }
  const LoadGrades = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/grades/${props.Course._id}`
      );
      console.log('grades');
      console.log(response.data.grades);
      setGrades(response.data.grades);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const LoadRoleAccount = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/roleAccount/${props.Course._id}`
      );
      
      if(response.data.roleAccount===1){
        
        setIsRoleTeacher(true);
      }
      
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  
  useEffect(()=>{
    LoadRoleAccount();
  },[]);

  useEffect(() => {
    LoadUsers();
  }, []);
  useEffect(() => {
    LoadNews();
  }, []);
  useEffect(() => {
    LoadNotifications();
  }, []);
  // useEffect(() => {
  //   LoadGradeStructure();
  // }, []);

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
    content = <CourseSettings Course={props.Course}  ></CourseSettings>;
  } else if (activeItem == 'Grades') {
    if(isRoleTeacher){
      content = <CourseGrade CourseId={props.Course._id} ></CourseGrade>;
    }
    else{
      content= (<CourseGradeStudent CourseId={props.Course._id}></CourseGradeStudent>);
    }
   
  } else if (activeItem == 'Grade Structure') {
    //We need to load the grade structure, currently not implemented
    content = (
      <CourseGradeStructure Course={props.Course}></CourseGradeStructure>
    );
  } else if (activeItem == 'Notifications') {
    //update sau
    content = <CourseNotifications Notifications={notifications}></CourseNotifications>;
  }

  return (
    <>
      <br />
      <Grid container>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular pointing color='blue'>
          <Menu.Item
              name='Notifications'
              active={activeItem === 'Notifications'}
              onClick={handleItemClick}
            />
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
