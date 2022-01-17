import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
import { List } from 'semantic-ui-react'

export const CourseNotifications = ({ Notifications}) => {
  console.log(Notifications)
  return (
    <div>
      <h1>Notifications </h1>
      <List divided relaxed>
        {Notifications.map((notification, i) => (
          <List.Item>
            <List.Icon name='user circle icon' size='large' verticalAlign='middle' />
            <List.Content>
              <List.Header >{notification.user}</List.Header>
              
              <List.Description> {notification.content}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
}
