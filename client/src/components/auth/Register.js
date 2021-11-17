import { Button, Form, Header } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageUI } from '../layouts/MessageUI';

const Register = () => {
  // Context
  const { registerUser } = useContext(AuthContext);
  //router
  const history = useHistory();
  // Local state
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    name: '',
  });
  //Alert message
  const [alertState, setAlertState] = useState(null);
  //Register
  const mySubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const registerData = await registerUser(registerForm);
      if (registerData.success) {
        history.push('./');
      } else {
        setAlertState({ type: 'warning', message: registerData.message });
        setTimeout(() => setAlertState(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const myChangeHandler = (event) => {
    setRegisterForm({
      ...registerForm,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <div className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <Header as='h1' color='olive' textAlign='center'>
            Sign-up to your account
          </Header>
          <Form onSubmit={mySubmitHandler} warning>
            <Form.Input
              icon='user'
              iconPosition='left'
              placeholder='E-mail address'
              type='email'
              name='email'
              onChange={myChangeHandler}
            />
            <Form.Input
              icon='user circle'
              iconPosition='left'
              placeholder='Name'
              type='text'
              name='name'
              onChange={myChangeHandler}
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              onChange={myChangeHandler}
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              placeholder='Confirm Password'
              type='password'
              name='confirmpw'
            />
            <MessageUI info={alertState} />

            <Button content='Sign up' primary type='submit' />
          </Form>
          <br />
          <p>
            Already have an account?
            <Link to='/login'> Log in</Link>
          </p>
          <p>
            <Link to='/' className='text-link'>
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
