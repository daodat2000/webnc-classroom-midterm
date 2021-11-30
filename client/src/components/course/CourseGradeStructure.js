import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './CourseGradeStructure.css';
const sampleScoreColumn = [
  {
    id: '1',
    GradeTitle: 'Exercise 1',
    GradeDetail: '10%'
  },
  {
    id: '2',
    GradeTitle: 'Exercise 2',
    GradeDetail: '10%'
  },
  {
    id: '3',
    GradeTitle: 'Midterm',
    GradeDetail: '30%'
  },
  {
    id: '4',
    GradeTitle: 'Seminar',
    GradeDetail: '10%'
  },
  {
    id: '5',
    GradeTitle: 'Final',
    GradeDetail: '40%'
  }
]

export const CourseGradeStructure = (props) => {
  const [scoreColumn, updateScoreColumn] = useState(sampleScoreColumn);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(scoreColumn);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateScoreColumn(items);
  }

  return (
    <div>
        <h1>Grade Structure</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="scoreColumn">
            {(provided) => (
              <ul className="scoreColumn" {...provided.droppableProps} ref={provided.innerRef}>
                {scoreColumn.map(({id, GradeTitle, GradeDetail}, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            {/* <div className="scoreColumn-thumb">
                              <img src={thumb} alt={`${name} Thumb`} />
                            </div> */}
                          <p>
                      
                          { GradeTitle }
                           
                          </p>
                          <p>
                          {GradeDetail}
                          </p>
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
}
