import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Profile } from './account/Profile';
import { Icon, Container, Header, Button, Segment } from 'semantic-ui-react';
import { Footer } from './Footer';

export const Dashboard = ({ mobile }) => {
  return (
    <div>
      <Segment
        textAlign='center'
        style={{ minHeight: 600, padding: '1em 0em' }}
        vertical
      >
        <Container text>
          <Header
            as='h1'
            content='PTUDWNC - 18_3'
            style={{
              fontSize: mobile ? '2em' : '4em',
              fontWeight: 'normal',
              marginBottom: 0,
              marginTop: mobile ? '1.5em' : '3em',
            }}
          />
          <Header
            as='h2'
            content='Do whatever you want when you want to.'
            inverted
            style={{
              fontSize: mobile ? '1.5em' : '1.7em',
              fontWeight: 'normal',
              marginTop: mobile ? '0.5em' : '1.5em',
            }}
          />
          <Button primary size='huge'>
            Get Started
            <Icon name='right arrow' />
          </Button>
        </Container>
      </Segment>

      <Footer />
    </div>
  );
};
