import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Profile } from './account/Profile';

export const Dashboard = () => {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route path={`${path}/profile`}>
          <Profile />
        </Route>
      </Switch>
      DashBoard
    </div>
  );
};
