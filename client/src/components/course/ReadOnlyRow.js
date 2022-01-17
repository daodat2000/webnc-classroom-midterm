
import React, { useState,useEffect } from "react";
import axios from 'axios';
const { REACT_APP_SERVER_URL } = process.env;

export const  ReadOnlyRow = ({student, gradeStructure, handleEditClick}) => {
    // console.log("Student");
    // console.log(student.studentId);
    console.log("gradeStructure");
    console.log(gradeStructure);
    
    const Student = student;
    ////Can sua du
    // const tempGrade =  new Array(gradeStructure.length).fill(0);
    let tempGrade;
    if (gradeStructure.length > 0){
        tempGrade =  new Array(gradeStructure.length).fill(0)
    }
    else tempGrade = [0, 0, 0];
    // console.log("tempGrade");
    // console.log(tempGrade);
    const [gradeStudents, setGradeStudents] = useState([]);
    const LoadGradesByStudentId = async () => {
        try {
          const response = await axios.get(
            `${REACT_APP_SERVER_URL}/course/grades/student/${student.studentId}`
          );
        //   console.log("grade student")
        //   console.log(student.studentId)
        //   console.log(response.data)
          for (let i = 0; i < response.data.gradeStudents.length; i++) {
            tempGrade[i] = response.data.gradeStudents[i].grade;
            //;
          }
          console.log(tempGrade);
          setGradeStudents(tempGrade);
        } catch (error) {
          if (error.response) return error.response.data;
          else return { success: false, message: error.message };
        }
      };
    useEffect(() => {
        LoadGradesByStudentId();
    }, []);
    return (
    <tr>
        <td>{Student.studentId}</td>
        <td>{Student.fullName}</td>

         {gradeStudents.map((gradeStudent, i) => (
        <td>{gradeStudent}</td>
        ))} 
            
        <td>
            <button type="button" onClick={(e)=> handleEditClick(e, Student)}>Edit</button>
        </td>
    </tr>
    )
}
export default ReadOnlyRow;