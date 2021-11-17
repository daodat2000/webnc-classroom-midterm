import React from 'react';
import { Alert } from 'react-bootstrap';

export const AlertMessage = ({ info }) => {
  return info === null ? null : (
    <div>
      <Alert variant={info.type}>{info.message}</Alert>
    </div>
  );
};
