import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CourseGradeStructure.css';
import { Button, Input, Segment } from 'semantic-ui-react';
import { useEffect } from 'react';
import axios from 'axios';
const { REACT_APP_SERVER_URL } = process.env;
const sampleScoreColumn = [
  {
    id: '1',
    GradeTitle: 'Exercise 1',
    GradeDetail: '10%',
  },
  {
    id: '2',
    GradeTitle: 'Exercise 2',
    GradeDetail: '10%',
  },
  {
    id: '3',
    GradeTitle: 'Midterm',
    GradeDetail: '30%',
  },
  {
    id: '4',
    GradeTitle: 'Seminar',
    GradeDetail: '10%',
  },
  {
    id: '5',
    GradeTitle: 'Final',
    GradeDetail: '40%',
  },
];



export const CourseGradeStructure = (props) => {
  console.log(props);
  //using for course grade structure
  //
  const [gradeStructure,setGradestructure] = useState([]);
  //const [scoreColumn, updateScoreColumn] = useState(sampleScoreColumn);
  const [editIndex, setEditIndex] = useState(1);
  const [addGrade, setAddGrade] = useState({
    GradeTitle: '',
    GradeDetail: '',
    // courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    // detail: Number,
    // title: String,
    // finalized:Boolean,
    // index: Number,
  });
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
    
    items[index].finalized = true;
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
    items.push(addGrade);
    setAddGrade({
      GradeTitle: '',
      GradeDetail: '',
    });
    setGradestructure(items);
  };
  const LoadGradeStructure = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_SERVER_URL}/course/gradestructure/6168f2f5b0c3a02a75af3394`
      );
      console.log("grade structure")
      console.log(response.data)
      setGradestructure(response.data.gradeStruture)
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
      alert("Successfully Updated");
      return response.data;
    } catch (error) {
      alert("Error Occured");
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
              {gradeStructure.map(({ _id, title, detail }, index) => {
                return (
                  <Draggable key={_id} draggableId={_id} index={index}>
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
                          name='GradeTitle'
                          onChange={changeHandlerEditGrade}
                        />
                        <Input
                          label='Grade Detail'
                          placeholder='Grade Detail'
                          value={detail}
                          disabled={editIndex !== index}
                          name='GradeDetail'
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
                          <Button onClick={() => FinalizedGradeStructure(index)}>
                            Finalize
                          </Button>
                        </Button.Group>
                      </li>
                    )}
                  </Draggable>
                );
              })}
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
          name='GradeTitle'
          onChange={changeHandlerAddGrade}
          value={addGrade.GradeTitle}
        />
        <Input
          label='Grade Detail'
          placeholder='Grade Detail'
          name='GradeDetail'
          onChange={changeHandlerAddGrade}
          value={addGrade.GradeDetail}
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
