import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CourseGradeStructure.css';
import { Button, Input } from 'semantic-ui-react';

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
                        {/* <div className="scoreColumn-thumb">
                              <img src={thumb} alt={`${name} Thumb`} />
                            </div> */}
                        {/* <p>{GradeTitle}</p> */}
                        <Input
                          label='Grade Title'
                          placeholder='Grade Title'
                          value={GradeTitle}
                          disabled={editIndex !== index}
                        />
                        <Input
                          label='Grade Detail'
                          placeholder='Grade Detail'
                          value={GradeDetail}
                          disabled={editIndex !== index}
                        />
                        {/* <p>{GradeDetail}</p> */}
                        <Button.Group>
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
    </div>
  );
};
