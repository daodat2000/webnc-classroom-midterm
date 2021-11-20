import React  from "react";
import TextareaAutosize from 'react-textarea-autosize';
export class CourseNews extends React.Component {
    render() {
      return (
       
        <div className="shopping-list">
          <h1>New Feeds </h1>
          <TextareaAutosize  style={{ width: "100%",height:"50%"}} />
          <ul>
            <li>Instagram</li>
            <li>WhatsApp</li>
            <li>Oculus</li>
          </ul>
        </div>
      );
    }
  }