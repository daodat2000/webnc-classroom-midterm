import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
import { List } from 'semantic-ui-react'

export const CourseGrade = ({Grade}) => {
  return (
    <div>
        <h1>Grades  </h1>
        <List>
        {Grade.map((grade, i) => (
           <List.Item>
           <List.Icon name='student'/>
           <List.Content>{grade.studentId}</List.Content>
           <List.Icon/>
           <List.Content>{grade.grade}</List.Content>
       </List.Item>
        ))}
        </List>
    </div>
  );
}
