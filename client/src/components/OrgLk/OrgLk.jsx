/* eslint-disable no-nested-ternary */
import './orgLk.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CoursesTable from '../CoursesTable/CoursesTable';
import Modal from '../Modal/Modal';

function OrgLk() {
  const [file, setFile] = useState(null);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const { currentOrganization } = useSelector((state) => state);
  useEffect(() => {
    setFile(currentOrganization.logo);
  }, [currentOrganization.logo]);

  const fileSend = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const imagefile = document.querySelector('#file');

    formData.append('orgPhotoId', currentOrganization.id);
    formData.append('filedata', imagefile.files[0]);

    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, formData, { withCredentials: true });
    if (response.data) {
      setFile(response.data);
    }
  };

  const addCourseButtonHandler = () => {
    setIsModalOpened((state) => !state);
  };

  return (
    <div className="container my-container">
      <div className="lkContainer">
        <div className="avatarContainer">
          {file
            ? <img src={`${process.env.REACT_APP_SERVER_URL}${file}`} alt="pic" className="avatar" />
            : <img src="https://www.ucheba.ru/img/userpic-empty-big.png" alt="pic" className="avatar" />}
          <div>
            <label htmlFor="file" className="btn btn-my-primary my-2">
              Обновить фото
              <input className="input-file form-control" type="file" name="filedata" id="file" onChange={(e) => fileSend(e)} style={{ width: '108px', margin: 'auto', display: 'none' }} />
            </label>
          </div>
        </div>
        <div className="courseInfoPageP3">
          <div className="title-name moderationSpan">
            <span>
              <h4>
                {`${currentOrganization.name} (${currentOrganization.OrganizationForm})`}
                <span>
                    &nbsp;
                  <Link to="/editUser">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe0-ruYIVTiRizPu8o-RjjR1KrGv-mqXJgLQ&usqp=CAU" alt="" width="40px" />
                  </Link>
                </span>
              </h4>
            </span>
            <span>
              {currentOrganization.is_checked
                ? null
                : <span style={{ color: 'orange', fontSize: '15px' }}>Заявка на регистрацию на рассмотрении у модератора</span>}
            </span>
          </div>
          <p style={{ textAlign: 'start' }}>Описание:</p>
          <p style={{ textAlign: 'start' }}>{`${currentOrganization.description ? currentOrganization.description : 'Не указано'}`}</p>
          <div style={{ textAlign: 'start' }}>
            <p>Контакты:</p>
            <p>{`Адрес: ${currentOrganization.address ? currentOrganization.address : 'Не указано'}`}</p>
            <p>{`Тел.: ${currentOrganization.phone}`}</p>
            <p>{`Сайт: ${currentOrganization.site ? currentOrganization.site : 'Не указано'}`}</p>
            <p>{`Почта: ${currentOrganization.email}`}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button className={toggleState === 1 ? 'nav-link active' : 'nav-link'} onClick={() => toggleTab(1)} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Главная</button>
            <button className={toggleState === 2 ? 'nav-link active' : 'nav-link'} onClick={() => toggleTab(2)} id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Профиль</button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className={toggleState === 1 ? 'tab-pane fade show active' : 'tab-pane fade'} id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
            <div className="courseInfoPageP2">
              <h3 style={{ textAlign: 'left' }}>
                {currentOrganization.is_checked && currentOrganization.is_allowed
                  ? (
                    <div className="addCoursesTitleDiv">
                      {' '}
                      <span>Текущие направления</span>
                      <button onClick={addCourseButtonHandler} type="button" className="btn btn-my-primary">Добавить направление</button>
                    </div>
                  )
                  : <span>Статус регистрации</span>}
              </h3>
              {isModalOpened ? (
                <Modal setIsModalOpened={setIsModalOpened} orgId={currentOrganization.id} />
              ) : null}
              <hr style={{ marginTop: 0 }} />
            </div>
            {currentOrganization.is_allowed
              ? (
                <div>
                  <div style={{ marginLeft: '30px' }}>
                    {Object.keys(currentOrganization).length
                      ? currentOrganization.OrganizationCourses.map((course) => (
                        <CoursesTable
                          key={course.id}
                          courseName={course.name}
                          coursePrice={course.price}
                          courseId={course.id}
                        />
                      )) : 'Здесь пока ничего нет' }
                  </div>
                </div>
              ) : currentOrganization.is_checked ? 'Заявка отклонена модератором' : 'Заявка на регистрацию на рассмотрении у модератора'}
          </div>

          <div className={toggleState === 2 ? 'tab-pane fade show active' : 'tab-pane fade'} id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
            {currentOrganization.is_allowed
              ? (
                <div>
                  <div>
                    <div>Отклики пользователей</div>
                    <hr />
                  </div>
                </div>
              ) : currentOrganization.is_checked ? 'Заявка отклонена модератором' : 'Заявка на регистрацию на рассмотрении у модератора'}
          </div>
        </div>
      </div>

    </div>
  );
}

export default React.memo(OrgLk);
