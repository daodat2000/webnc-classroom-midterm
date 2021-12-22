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
  const uploadFileHandler = (event, gradeStructureid) => {
    var formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('gradeStructureId', gradeStructureid);
    formData.append('courseId', CourseId.CourseId);
    // API CALL
    axios({
      method: 'post',
      url: `${REACT_APP_SERVER_URL}/course/grade/upload`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

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
        `${REACT_APP_SERVER_URL}/course/gradeboard/${CourseId.CourseId}`
      );
      console.log(response.data);
      setGrades(response.data.data);
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
  const updateGrade = async (grade, studentId, gradeStructureId) => {
    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/course/grade/update`,
        {
          studentId: studentId,
          gradeStructureId: gradeStructureId,
          grade: grade,
          courseId: CourseId.CourseId,
        }
      );
    } catch (error) {
      alert('Error update');
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
            <Table.HeaderCell>Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grades.map((student, i) => (
            <Table.Row>
              <Table.Cell>{student.studentId}</Table.Cell>
              <Table.Cell>{student.studentName}</Table.Cell>
              {student.grades.map((grade, i) => (
                <Table.Cell>
                  <Input
                    size='mini'
                    focus
                    defaultValue={grade.grade}
                    name='displayName'
                    type='text'
                    onChange={(e) => {
                      console.log(e.target.value);
                      updateGrade(
                        e.target.value,
                        student.studentId,
                        grade.gradeStructureId
                      );
                    }}
                  />
                </Table.Cell>
              ))}
              <Table.Cell>{student.total}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {csvGrades !== null ? (
        <CSVLink {...csvGrades}>Export to CSV</CSVLink>
      ) : (
        ''
      )}
      {gradeStructure.map((gt, i) => (
        <p>
          <Input
            label={gt.title}
            type='file'
            onChange={(event) => uploadFileHandler(event, gt._id)}
          />
        </p>
      ))}
    </div>
  );
};
