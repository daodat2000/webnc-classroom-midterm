import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
import { List } from 'semantic-ui-react'

export const CourseGrade = () => {
 
  return (
    <div>
        <h1>Grades  </h1>
        <List>
            <List.Item>
                <List.Icon name='student'/>
                <List.Content>Võ Ngọc Mẫn</List.Content>
                <List.Icon/>
                <List.Content>10</List.Content>
            </List.Item>
        </List>
    </div>
  );
}
