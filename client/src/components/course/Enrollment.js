import React, { useState, useEffect, useContext } from 'react';
import { useRouteMatch, useLocation, Switch, Route } from 'react-router-dom';
import { Form, Button, Message, Container } from 'semantic-ui-react';
import { CourseContext } from './Course';

export const Enrollment = () => {
  const location = useLocation();
  const { REACT_APP_SERVER_URL } = process.env;
  const [enroll, setEnroll] = useState('Loading...');
  const { joinClass } = useContext(CourseContext);
  // const joinClass = async (Server, pathname) => {
  //   try {
  //     const response = await axios.get(
  //       `${REACT_APP_SERVER_URL}${location.pathname}`
  //     );
  //     console.log(response.data);
  //     setEnroll(response.data.message);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     if (error.response) {
  //       setEnroll(error.response.data.message);
  //       return error.response.data;
  //     }
  //     setEnroll(error);
  //   }
  // };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  console.log(location.search);
  useEffect(async () => {
    const result = await joinClass(location.pathname + location.search);
    if (result !== undefined) {
      setEnroll(result.message);
    } else setEnroll('404');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Container>
      <Message>
        <Message.Header>Invitation link</Message.Header>
        <p>{enroll}</p>
      </Message>
    </Container>
  );
};
