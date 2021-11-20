import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
import { List } from 'semantic-ui-react'

export const CourseNews = ({ News,onSubmit }) => {
  console.log(News[0])
  const [content,setContent]=useState("");
  const submitStatus =() =>{
    onSubmit(content)
    setContent("");
  }
  return (
    <div>
      <h1>New Feeds </h1>
      <Form>
        <Form.Field>
          <label>Content</label>
          <TextareaAutosize style={{ width: "100%", height: "50%" }} 
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" onClick={submitStatus}  primary  >Post</Button>
      </Form>
      <br></br>
      <List divided relaxed>
        {News.map((news, i) => (
          <List.Item>
            <List.Icon name='user circle icon' size='large' verticalAlign='middle' />
            <List.Content>
              <List.Header >{news.user}</List.Header>
              <br></br>
              <List.Description>{news.content}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
}
