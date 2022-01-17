
import React, { useState,useEffect } from "react";
import axios from 'axios';
const { REACT_APP_SERVER_URL } = process.env;
export const EditableRow  = ({student, gradeStructure, handleCancelClick}) => {
    // console.log("Student");
    // console.log(student.studentId);
    //console.log(grades);
    
    const Student = student;
    // let tempGrade =  new Array(gradeStructure.length).fill(0);
    let tempGrade = [0, 0, 0];
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
    
    const handleEditFormSubmit =  (event, student, gradeStudents) => {
        event.preventDefault();
        console.log("test edit score");
        console.log(student.studentId);
        console.log(gradeStudents);
        //console.log(gradeStructure);
        try {
            const response = axios.post(
              `${REACT_APP_SERVER_URL}/course/grades/student/${student.studentId}`,
              {
                gradeStudents: gradeStudents,
                gradeStructure: gradeStructure,
              }
            );
            //setEmailState('');
            alert('Successfully Updated');
            return response.data;
          } catch (error) {
            alert('Error Occured');
            if (error.response) {
              return error.response.data;
            }
          }        
      }

    return (
    <tr>
        <td>{Student.studentId}</td>
        <td>{Student.fullName}</td>
        
         {gradeStudents.map((gradeStudent, i) => (
             <td>
                <input type="text" 
                // value={gradeStudent}
                onChange={(e)=> {
                    gradeStudents[i] = e.target.value
                    setGradeStudents(gradeStudents);
                }}
                />
             </td>
        ))} 
            
        <td>
            <button type="button" onClick={(e)=> handleEditFormSubmit(e, student, gradeStudents)}>Save</button>
        </td>
        <td>
            <button type="button" onClick={(e)=> handleCancelClick(e, student, gradeStudents)}>Cancel</button>
        </td>
    </tr>
    )
}
export default EditableRow;