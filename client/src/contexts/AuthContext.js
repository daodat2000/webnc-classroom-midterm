import { createContext, useReducer, useEffect } from 'react';
import { authReducer } from '../reducers/authReducer';
import axios from 'axios';
import setAuthToken from '../uitls/setAuthToken';
export const AuthContext = createContext();
const {
  REACT_APP_SERVER_URL,
  REACT_APP_TOKEN_NAME,
  REACT_APP_REFRESH_TOKEN_NAME,
} = process.env;
const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });
  //SaveToken
  const SaveToken = (data) => {
    if (data.success) {
      localStorage.setItem(REACT_APP_TOKEN_NAME, data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem(REACT_APP_REFRESH_TOKEN_NAME, data.refreshToken);
      }
    }
  };
  console.log(authState.user);
  //Authentcate user
  const loadUser = async () => {
    if (localStorage[REACT_APP_TOKEN_NAME]) {
      setAuthToken(localStorage[REACT_APP_TOKEN_NAME]);
    }

    try {
      const response = await axios.get(`${REACT_APP_SERVER_URL}/auth`);
      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: { isAuthenticated: true, user: response.data.user },
        });
      }
    } catch (error) {
      console.log(error);
      if (localStorage[REACT_APP_REFRESH_TOKEN_NAME]) {
        try {
          const token = await axios.post(
            `${REACT_APP_SERVER_URL}/auth/refresh_token`,
            {
              refreshToken: localStorage[REACT_APP_REFRESH_TOKEN_NAME],
            }
          );
          SaveToken(token.data);
          await loadUser();
        } catch (error) {
          localStorage.removeItem(REACT_APP_TOKEN_NAME);
          localStorage.removeItem(REACT_APP_REFRESH_TOKEN_NAME);
          setAuthToken(null);
          dispatch({
            type: 'SET_AUTH',
            payload: { isAuthenticated: false, user: null },
          });
        }
      } else {
        localStorage.removeItem(REACT_APP_TOKEN_NAME);
        localStorage.removeItem(REACT_APP_REFRESH_TOKEN_NAME);
        setAuthToken(null);
        dispatch({
          type: 'SET_AUTH',
          payload: { isAuthenticated: false, user: null },
        });
      }
    }
  };
  useEffect(() => {
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //Login
  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/auth/login`,
        userForm
      );
      SaveToken(response.data);
      await loadUser();
      return response.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };
  const loginWithGoogle = (response) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_SERVER_URL}/auth/googlelogin`,
      data: { tokenId: response.tokenId },
    }).then((response) => {
      console.log(response);
      SaveToken(response.data);
      loadUser();
    });
  };
  //register
  const registerUser = async (userForm) => {
    try {
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/auth/register`,
        userForm
      );
      SaveToken(response.data);
      await loadUser();
      return response.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem(REACT_APP_TOKEN_NAME);
    localStorage.removeItem(REACT_APP_REFRESH_TOKEN_NAME);
    dispatch({
      type: 'SET_AUTH',
      payload: { isAuthenticated: false, user: null },
    });
  };

  //ContextData
  const authContextData = {
    loginUser,
    loginWithGoogle,
    registerUser,
    logoutUser,
    authState,
  };

  //return provider
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
