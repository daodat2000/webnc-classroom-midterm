import React from 'react';
export const CourseMember = ({Students,Teachers}) => {
  console.log(Students)
  return (
    <div>
      <h2>Teachers</h2>
      <ul>
        {Teachers.map((teacher,i) => <li key={i}>{teacher.name}</li>)}
      </ul>
      <h2>Students</h2>
      <ul>
        {Students.map((student,i) => <li key={i}>{student.name}</li>)}
      </ul>
     
    </div>
  );
}
  