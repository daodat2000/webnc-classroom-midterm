import React from 'react';
export const CourseMember = ({ Students, Teachers }) => {
  console.log(Students);
  return (
    <div>
      <h1>Teachers</h1>
      <ul>
        {Teachers.map((teacher, i) => (
          <li key={i}>{teacher.name}</li>
        ))}
      </ul>
      <h1>Students</h1>
      <ul>
        {Students.map((student, i) => (
          <li key={i}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
};
