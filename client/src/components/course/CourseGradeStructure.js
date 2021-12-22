import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CourseGradeStructure.css';
import { Button, Input, Segment } from 'semantic-ui-react';
import { useEffect } from 'react';
import axios from 'axios';
const { REACT_APP_SERVER_URL } = process.env;

export const CourseGradeStructure = (props) => {
  console.log(props.Course);
  //using for course grade structure
  //
  const [gradeStructure, setGradestructure] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [addGrade, setAddGrade] = useState({
    detail: '',
    title: '',
  });
  console.log(gradeStructure.length);
  useEffect((props) => {
    LoadGradeStructure();
  }, []);
  const changeHandlerAddGrade = (event) => {
    setAddGrade({ ...addGrade, [event.target.name]: event.target.value });
  };
  const changeHandlerEditGrade = (event) => {
    const items = Array.from(gradeStructure);
    items[editIndex] = {
      ...items[editIndex],
      [event.target.name]: event.target.value,
    };
    setGradestructure(items);
  };
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(gradeStructure);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGradestructure(items);
  }
  const DeleteGradeStructure = (index) => {
    console.log(index);
    const items = Array.from(gradeStructure);
    items.splice(index, 1);
    setGradestructure(items);
  };
  const FinalizedGradeStructure = (index) => {
    const items = Array.from(gradeStructure);

    items[index].finalized = !items[index].finalized;
    console.log(index);
    console.log(items[index]);
    setGradestructure(items);
  };
  const EditGradeStructure = (index) => {
    console.log(index);
    setEditIndex(index);
  };
  const SaveGradeStructure = (index) => {
    console.log(index);
    setEditIndex(-1);
  };
  const AddGradeStructure = () => {
    const items = Array.from(gradeStructure);
    const newgrade = addGrade;
    newgrade.id = (items.length + 1).toString();
    newgrade.courseId = props.Course._id;
    newgrade.finalized = false;
    newgrade.index = items.length + 1;
    items.push(addGrade);
    setAddGrade({
      detail: '',
      title: '',
    });
    setGradestructure(items);
  };
  const LoadGradeStructure = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/gradestructure/${props.Course._id}`
      );
      console.log('grade structure');
      console.log(response.data);
      setGradestructure(response.data.gradeStruture);
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  const SubmitGradeStructure = async () => {
    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/course/gradestructure/edit`,
        {
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
  };
  return (
    <div>
      <h1>Grade Structure</h1>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='scoreColumn'>
          {(provided) => (
            <ul
              className='scoreColumn'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {gradeStructure.map(
                ({ _id, id, title, detail, finalized }, index) => {
                  return (
                    <Draggable
                      key={_id ? _id : id}
                      draggableId={_id ? _id : id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Input
                            label='Grade Title'
                            placeholder='Grade Title'
                            value={title}
                            disabled={editIndex !== index}
                            name='title'
                            onChange={changeHandlerEditGrade}
                          />
                          <Input
                            label='Grade Detail'
                            placeholder='Grade Detail'
                            value={detail}
                            disabled={editIndex !== index}
                            name='detail'
                            onChange={changeHandlerEditGrade}
                          />
                          {/* <p>{GradeDetail}</p> */}
                          <Button.Group className='button-group'>
                            <Button onClick={() => DeleteGradeStructure(index)}>
                              Delete
                            </Button>
                            <Button.Or />
                            {editIndex !== index ? (
                              <Button onClick={() => EditGradeStructure(index)}>
                                Edit
                              </Button>
                            ) : (
                              <Button
                                positive
                                onClick={() => SaveGradeStructure(index)}
                              >
                                Save
                              </Button>
                            )}
                            <Button.Or />
                            {finalized === false ? (
                              <Button
                                onClick={() => FinalizedGradeStructure(index)}
                              >
                                Finalize
                              </Button>
                            ) : (
                              <Button
                                positive
                                onClick={() => FinalizedGradeStructure(index)}
                              >
                                Finalize
                              </Button>
                            )}
                          </Button.Group>
                        </li>
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <br />
      <Segment>
        <Input
          label='Grade Title'
          placeholder='Grade Title'
          name='title'
          onChange={changeHandlerAddGrade}
          value={addGrade.title}
        />
        <Input
          label='Grade Detail'
          placeholder='Grade Detail'
          name='detail'
          onChange={changeHandlerAddGrade}
          value={addGrade.detail}
        />
        {/* <p>{GradeDetail}</p> */}
        <Button className='button-group' onClick={() => AddGradeStructure()}>
          Add
        </Button>
      </Segment>
      <Button className='button-group' onClick={() => SubmitGradeStructure()}>
        Submit
      </Button>
    </div>
  );
};
