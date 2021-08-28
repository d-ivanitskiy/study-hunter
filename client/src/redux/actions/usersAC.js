import axios from 'axios';
import {
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
} from '../types/usersTypes';

// logout ACs
export const logoutUserSuccess = () => ({
  type: LOGOUT_USER_SUCCESS,
});

export const logoutUserFail = () => ({
  type: LOGOUT_USER_FAIL,
});

export const logoutUserStart = () => (dispatch) => {
  axios.get('http://localhost:3005/logout')
    .then((res) => {
      if (res.data === 'OK') {
        dispatch(logoutUserSuccess());
      }
    });
};

// register ACs
export const registerUserSuccess = (currentUser) => ({
  type: REGISTER_USER_SUCCESS,
  payload: currentUser,
});

export const registerUserFail = () => ({
  type: REGISTER_USER_FAIL,
});

// eslint-disable-next-line max-len
export const registerUserStart = (firstName, lastName, phone, email, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:3005/signup/user', {
      firstName, lastName, phone, email, password,
    });
    // console.log(response.data);
    dispatch(registerUserSuccess(response.data));
  } catch {
    console.log('Unable to register');
    dispatch(registerUserFail());
  }
};

// login ACs
export const loginUserSuccess = (currentUser) => ({
  type: LOGIN_USER_SUCCESS,
  payload: currentUser,
});

export const loginUserFail = () => ({
  type: LOGIN_USER_FAIL,
});

export const loginUserStart = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:3005/signin/user', {
      email, password,
    });
    // console.log(response.data);
    dispatch(loginUserSuccess(response.data));
  } catch {
    console.log('Unable to login');
    dispatch(loginUserFail());
  }
};
