import React  from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'semantic-ui-react'
import { Form } from 'semantic-ui-react'
export class CourseNews extends React.Component {
    render() {
      return (
        <div className="shopping-list">
          <h1>New Feeds </h1>
          <Form>
          <Form.Field>
            <label>Content</label>
            <TextareaAutosize  style={{ width: "100%",height:"50%"}} />          
          </Form.Field>
          <Button primary >Post</Button>
        </Form>
          <ul>
            <li>Instagram</li>
            <li>WhatsApp</li>
            <li>Oculus</li>
          </ul>
        </div>
      );
    }
  }