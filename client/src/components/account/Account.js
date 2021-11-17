import React, { Component } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';

export default class Account extends Component {
  state = { activeItem: 'account' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <>
        <br />
        <Grid container>
          <Grid.Column width={4}>
            <Menu fluid vertical tabular pointing color='blue'>
              <Menu.Item
                name='account'
                active={activeItem === 'account'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='profile'
                active={activeItem === 'profile'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='companies'
                active={activeItem === 'companies'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='setting'
                active={activeItem === 'setting'}
                onClick={this.handleItemClick}
              />
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={12}>
            <Segment>
              This is an stretched grid column. This segment will always match
              the tab height
            </Segment>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}
