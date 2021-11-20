import React from 'react';
import { Container, Header, Grid, Segment, List } from 'semantic-ui-react';

export const Footer = () => {
  return (
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>HCMUS</List.Item>
                <List.Item as='a'>PTUDWNC - 18_3</List.Item>
                <List.Item as='a'>About</List.Item>
                <List.Item as='a'>Contact</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Student' />
              <List link inverted>
                <List.Item as='a'>18120014 - Dao Thanh Dat</List.Item>
                <List.Item as='a'>18120461 - Vo Ngoc Man</List.Item>
                <List.Item as='a'>18120115 - Tran Quoc Bao</List.Item>
                <List.Item as='a'>
                  -----------------------------------
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could
                help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};
