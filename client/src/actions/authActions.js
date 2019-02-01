import axios from 'axios';
// import {TEST_DISPATCH} from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {GET_ERRORS,SET_CURRENT_USER} from './types';

// *********************  Register User  *************************
export const registerUser=(userData,history)=>dispatch=>{
    // return{
    //     type:TEST_DISPATCH,
    //     payload:userData
    // }

    axios
    .post('/api/users/register',userData)
    // .then(res=>console.log(res.data))
    // .catch(err=>this.setState({errors:err.response.data}));
    .then(res=>history.push('/login'))
    .catch(err=>
        dispatch({
            type:GET_ERRORS,
            payload:err.response.data
        }));
};

// *********************  Register User End  *************************

// *********************  Login - Get user token  *************************
export const loginUser=(userData)=>dispatch=>{
    axios
    .post('/api/users/login',userData)
    .then(res=>{
        // Save to localStorage
        const {token}=res.data;

        // Set token to localStorage
        localStorage.setItem('jwtToken',token);  // accepts strings only

        // Set token to Auth Header
        setAuthToken(token); 
        // ********** token contains everything about user,
        // such as, username,email,etc

        // Decode token to get user data
        const decoded=jwt_decode(token);

        // Set current user
        dispatch(setCurrentUser(decoded));
    })
     .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// *********************  Login - Get user token End *************************

// Set current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// ************************** Logout *******************************
export const logoutUser=()=>dispatch=>{
// Remove token from localStorage
localStorage.removeItem('jwtToken');

// Remove auth header for future requests
setAuthToken(false);   // it will make the changes in --> utils/setAuthToken file
                        // and set the token to false

// Set current user to empty object {}, which will set isAuthenticated to false
dispatch(setCurrentUser({})); 
};


// ************************** Logout Ends*******************************