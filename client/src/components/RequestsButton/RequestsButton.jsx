/* eslint-disable no-nested-ternary */
import './requestButton.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PopUp from '../PopUp/PopUp';
import { addRequestUserStart, removeRequestUserStart } from '../../redux/actions/usersAC';

function RequestsButton({ userId, courseId }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state);
  const [popupActive, setPopupActive] = useState(false);
  const [isRequested, setIsRequested] = useState(null);

  const requestHandler = () => {
    dispatch(addRequestUserStart(userId, courseId));
  };

  const removeRequestHandler = () => {
    dispatch(removeRequestUserStart(userId, courseId));
    setIsRequested((prev) => !prev);
  };

  useEffect(() => {
    if (Object.keys(currentUser).length) {
      axios.post(`${process.env.REACT_APP_SERVER_URL}/isrequested`, { userId, courseId }, { withCredentials: true })
        .then((response) => setIsRequested(response.data));
    }
  }, [currentUser.requests]);

  return (
    {isRequested ? (
      <button type="button" className="btn btn-success mt-3 mb-0" onClick={removeRequestHandler}>Отклик отправлен</button>
    ) : (Object.keys(currentUser).length
      ? (
        <button onClick={requestHandler} type="button" className="btn btn-my-primary mt-3">Хочу здесь учиться!</button>
      ) : <button onClick={() => setPopupActive(true)} type="button" className="btn btn-primary mt-3 open-btn">Откликнуться!</button>
    )}
     <PopUp active={popupActive} setActive={setPopupActive} />
  );
}


export default React.memo(RequestsButton);
