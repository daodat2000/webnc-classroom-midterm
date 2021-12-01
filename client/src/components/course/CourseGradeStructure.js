import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CourseGradeStructure.css';
import { Button, Input, Segment } from 'semantic-ui-react';

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
  const [scoreColumn, updateScoreColumn] = useState(sampleScoreColumn);
  const [editIndex, setEditIndex] = useState(1);
  const [addGrade, setAddGrade] = useState({
    GradeTitle: '',
    GradeDetail: '',
  });
  const changeHandlerAddGrade = (event) => {
    setAddGrade({ ...addGrade, [event.target.name]: event.target.value });
  };
  const changeHandlerEditGrade = (event) => {
    const items = Array.from(scoreColumn);
    items[editIndex] = {
      ...items[editIndex],
      [event.target.name]: event.target.value,
    };
    updateScoreColumn(items);
  };
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(scoreColumn);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateScoreColumn(items);
  }
  const DeleteGradeStructure = (index) => {
    console.log(index);
    const items = Array.from(scoreColumn);
    items.splice(index, 1);

    updateScoreColumn(items);
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
    const items = Array.from(scoreColumn);
    const newgrade = addGrade;
    newgrade.id = (items.length + 1).toString();
    items.push(addGrade);
    setAddGrade({
      GradeTitle: '',
      GradeDetail: '',
    });
    updateScoreColumn(items);
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
              {scoreColumn.map(({ id, GradeTitle, GradeDetail }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Input
                          label='Grade Title'
                          placeholder='Grade Title'
                          value={GradeTitle}
                          disabled={editIndex !== index}
                          name='GradeTitle'
                          onChange={changeHandlerEditGrade}
                        />
                        <Input
                          label='Grade Detail'
                          placeholder='Grade Detail'
                          value={GradeDetail}
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
    </div>
  );
};
