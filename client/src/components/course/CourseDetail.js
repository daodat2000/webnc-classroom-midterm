import React from 'react';

import { CourseMember } from './CourseMember';
import { CourseNews } from './CourseNews';
import { useState } from 'react';
import { Grid, Menu, Segment } from 'semantic-ui-react';







  export const ShoppingList = () => {
    const [activeItem,setActiveItem] =useState('New Feeds');
 
    const [member, setMember] = useState(true);
    const handleItemClick = (e, { name }) => setActiveItem(name);
   
    
    let content;
    if (activeItem === 'Members') {
      content = <CourseMember></CourseMember>
    }
    else {
      content = <CourseNews></CourseNews>
    }

    return (
      <>
        <br />
        <Grid container>
          <Grid.Column width={4}>
            <Menu fluid vertical tabular pointing color='blue'>
              <Menu.Item
                name='New Feeds'
                active={activeItem === 'New Feeds'}
                onClick={handleItemClick}
              />
              <Menu.Item
                name='Members'
                active={activeItem === 'Members'}
                onClick={handleItemClick}
              />
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={12}>
            <Segment>
            
             {content}
            </Segment>
          </Grid.Column>
        </Grid>
      </>



      // <Container>
      //   <Nav defaultActiveKey="/home" as="ul">
      //     <Nav.Item as="li">
      //       <Nav.Link onClick={()=>setMember(false)}>News Feed</Nav.Link>
      //     </Nav.Item>
      //     <Nav.Item as="li">
      //       <Nav.Link onClick={()=>setMember(true)}>Members</Nav.Link>
      //     </Nav.Item>
      //   </Nav>
      //   {abc}



      // </Container>




    );

}
