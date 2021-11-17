import React from 'react';
import { Message } from 'semantic-ui-react';
export const MessageUI = ({ info }) => {
  let body = null;
  if (info) {
    if (info.type === 'success')
      body = <Message success>{info.message}</Message>;
    else if (info.type === 'error')
      body = <Message error>{info.message}</Message>;
    else body = <Message warning>{info.message}</Message>;
  }
  return <>{body}</>;
};
