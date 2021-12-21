import React, { useState,useEffect } from "react";
import { Table } from 'semantic-ui-react'
import axios from 'axios';
import { Input } from 'semantic-ui-react'
const { REACT_APP_SERVER_URL } = process.env;

export const CourseGrade = (CourseId) => {
  console.log(CourseId)
  const [students,setStudents]=useState([]);
  const [gradeStructure,setGradestructure] = useState([]);
  const LoadData = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/getStudentList/${CourseId.CourseId}`
      );
      //console.log(response.data)
      setStudents(response.data.students);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const LoadGradeStructure = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/gradestructure/${CourseId.CourseId}`
      );
      //console.log("grade structure")
      //console.log(response.data)
      setGradestructure(response.data.gradeStruture)
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    LoadData();
  }, []);

  useEffect(() => {
    LoadGradeStructure();
  }, []);
  
  
  return (
    <Table striped>
    <Table.Header> 
         <Table.Row>
         <Table.HeaderCell>MSSV</Table.HeaderCell>
         <Table.HeaderCell>Name</Table.HeaderCell>
          {gradeStructure.map((student, i) => (
         <Table.HeaderCell>{student.title}</Table.HeaderCell>
         ))}
       </Table.Row>
    </Table.Header>
    <Table.Body>
        {students.map((student, i) => (
          <Table.Row>
          <Table.Cell>{student.studentId}</Table.Cell>
          <Table.Cell>{student.fullName}</Table.Cell>
          {gradeStructure.map((student, i) => (
         <Table.Cell><Input size="mini"  focus /></Table.Cell>
         ))}
        </Table.Row>
        ))}
    </Table.Body>
  </Table>
  );
}