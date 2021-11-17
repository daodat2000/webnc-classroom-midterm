import { Button, Form, Header } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageUI } from '../layouts/MessageUI';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  // Context
  const { loginUser, loginWithGoogle } = useContext(AuthContext);
  //router
  const history = useHistory();
  // Local state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  //Alert message
  const [alertState, setAlertState] = useState(null);
  const mySubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const loginData = await loginUser(loginForm);
      if (loginData.success) {
        history.push('./');
      } else {
        setAlertState({ type: 'warning', message: loginData.message });
        setTimeout(() => setAlertState(null), 5000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const myChangeHandler = (event) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };
  const responseErrorGoogle = (response) => {
    console.log(response);
  };
  return (
    <div className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <Header as='h1' color='olive' textAlign='center'>
            Log-in to your account
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
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              onChange={myChangeHandler}
            />
            <MessageUI info={alertState} />

            <Button content='Sign in' primary type='submit' />
          </Form>
          <br />
          <GoogleLogin
            clientId='575346049128-g436js10llmus2r13ksl5akanhkjvl18.apps.googleusercontent.com'
            onSuccess={loginWithGoogle}
            onFailure={responseErrorGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <p>
            Don't have an account?
            <Link to='/register'> Register</Link>
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
export default Login;
