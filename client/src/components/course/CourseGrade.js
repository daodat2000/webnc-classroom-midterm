import React, { useState, useEffect } from 'react';
import { Table, Button } from 'semantic-ui-react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { CSVLink } from 'react-csv';

const { REACT_APP_SERVER_URL } = process.env;

export const CourseGrade = (CourseId) => {
  console.log(CourseId);
  const [students, setStudents] = useState([]);
  const [gradeStructure, setGradestructure] = useState([]);
  const [grades, setGrades] = useState([]);
  const [csvGrades, setCsvGrades] = useState(null);
  //for table
  // cosnt [table, setTable] = useState([]);

  const LoadData = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/getStudentList/${CourseId.CourseId}`
      );
      // console.log("Student");
      // console.log(response.data)
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
      setGradestructure(response.data.gradeStruture);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const LoadGrades = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/grades/${CourseId.CourseId}`
      );
      console.log('grades');
      console.log(response.data);
      setGrades(response.data.grades);
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

  useEffect(() => {
    LoadGrades();
  }, []);
  useEffect(() => {
    ExportGrade();
  }, []);
  // const colums = [
  //   {title: "MSSV"}
  // ]
  const ExportGrade = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/grade/download/${CourseId.CourseId}`
      );
      console.log('grade structure');
      console.log(response.data);
      setCsvGrades({
        data: response.data.data,
        headers: response.data.headers,
        filename: 'grade.csv',
      });
    } catch (error) {
      alert('Error downloading');
    }
  };
  return (
    <div>
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
              {grades.map((grade, i) => (
                <Table.Cell>
                  <Input
                    size='mini'
                    focus
                    value={grade.grade}
                    name='displayName'
                    type='text'
                    onChange={(e) => {
                      console.log();
                    }}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {csvGrades !== null ? (
        <CSVLink {...csvGrades}>Export to CSV</CSVLink>
      ) : (
        ''
      )}
    </div>
  );
};
