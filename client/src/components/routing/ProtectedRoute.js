import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
export const ProtectedRoute = ({ ...rest }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);
  if (authLoading) {
    return (
      <div className='d-flex justify-content-center mt-2'>
        <Spinner animation='border' variant='info' />
      </div>
    );
  } else if (!isAuthenticated) return <Redirect to='/login' />;
  else {
    return <Route {...rest} />;
  }
};

export default ProtectedRoute;
