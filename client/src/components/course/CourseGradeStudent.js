import React, { useState, useEffect } from 'react';
import { Table, Button } from 'semantic-ui-react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';


const { REACT_APP_SERVER_URL } = process.env;

export const CourseGradeStudent = (CourseId) => {
  console.log(CourseId);

  const [gradeStructure, setGradestructure] = useState([]);
  const [grades, setGrades] = useState([]);

  const LoadGradeStructure = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/gradestructure/${CourseId.CourseId}`
      );
      //console.log("grade structure")
      //console.log(response.data)
      setGradestructure(response.data.gradeStruture);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const LoadGrades = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/gradesStudent/${CourseId.CourseId}`
      );
      console.log(response.data);
      setGrades(response.data.data);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

//   useEffect(() => {
//     LoadData();
//   }, []);

  useEffect(() => {
    LoadGradeStructure();
  }, []);

  useEffect(() => {
    LoadGrades();
  }, []);
 

 
  return (
    <div>
        
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>MSSV</Table.HeaderCell>
            {/* //<Table.HeaderCell>Name</Table.HeaderCell> */}
            {gradeStructure.map((student, i) => (
              <Table.HeaderCell>{student.title}</Table.HeaderCell>
            ))}
            <Table.HeaderCell>Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grades.map((student, i) => (
            <Table.Row>
              <Table.Cell>{student.studentId}</Table.Cell>
              {/* <Table.Cell>{student.studentName}</Table.Cell> */}
              {student.grades.map((grade, i) => (
                <Table.Cell>
                  {grade.grade}
                </Table.Cell>
              ))}
              <Table.Cell>{student.total}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
     
    </div>
  );
};
