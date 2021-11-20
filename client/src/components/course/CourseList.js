import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { CourseContext } from './Course';
export const CourseList = () => {
  let { path, url } = useRouteMatch();
  const { courseState } = useContext(CourseContext);
  return (
    <>
      <br />
      <Card.Group itemsPerRow={4}>
        {courseState.map((course, i) => (
          <Card
            key={i}
            href='#'
            color='red'
            as={Link}
            to={`${url}/${course.name}`}
          >
            <Card.Content>
              <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
              />
              <Card.Header>{course.name}</Card.Header>
              <Card.Meta>{course.teacher}</Card.Meta>
              <Card.Description>{course.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Icon name='user' />
              {course.membership} Học sinh
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
};
