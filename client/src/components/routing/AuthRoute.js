import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
export const AuthRoute = ({ component: Component, ...rest }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);
  if (authLoading) {
    return (
      <div className='d-flex justify-content-center mt-2'>
        <Spinner animation='border' variant='info' />
      </div>
    );
  } else if (isAuthenticated) return <Redirect to='/' />;
  else {
    return (
      <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
    );
  }
};

export default AuthRoute;
