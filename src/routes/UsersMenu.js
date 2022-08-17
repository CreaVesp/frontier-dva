import { Fragment, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stateActions } from '../store/common-state';
import { sendCommonData } from '../store/common-actions';

import List from '../components/Lists/List';
import DeleteNotification from '../components/UI/DeleteNotification';
import AddUserForm from '../components/UI/Forms/AddUserForm';
import EditUserForm from '../components/UI/Forms/EditUserForm';

import classes from './Menu.module.css';
import { Outlet } from 'react-router-dom';

const UsersMenu = props => {
  const userRef = useRef('');
  const [userIsChosen, setUserIsChosen] = useState(false);
  const [renderedClient, setRenderedClient] = useState([]);
  const [renderedProducts, setRenderedProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const dispatch = useDispatch();

  const commonState = useSelector(state => state.commonState);

  useEffect(() => {
    if (formIsSubmitted) {
      console.log(commonState);
      dispatch(sendCommonData(commonState));
      setFormIsSubmitted(false);
      setUserIsChosen(false);
    }
  }, [formIsSubmitted, dispatch, commonState]);

  const fetchedClients = props.clients;
  const fetchedUsers = props.users;
  const fetchedProducts = props.products;

  const clientsProcessed = [];

  for (const key in fetchedClients) {
    clientsProcessed.push({
      id: fetchedClients[key].id,
      name: fetchedClients[key].name,
      linkedUsers: fetchedClients[key].linkedUsers,
      availableProducts: fetchedClients[key].availableProducts,
    });
  }

  const usersProcessed = [];

  for (const key in fetchedUsers) {
    usersProcessed.push({
      id: fetchedUsers[key].id,
      name: fetchedUsers[key].name,
      linkedClients: fetchedUsers[key].linkedClients,
      availableProducts: fetchedUsers[key].availableProducts,
    });
  }

  const productsProcessed = [];

  for (const key in fetchedProducts) {
    productsProcessed.push({
      id: fetchedProducts[key].id,
      name: fetchedProducts[key].name,
      availableToClients: fetchedProducts[key].availableToClients,
      availableToUsers: fetchedProducts[key].availableToUsers,
    });
  }

  const usersSelector = usersProcessed.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const onSubmitHandler = e => {
    e.preventDefault();
    const chosenUser = userRef.current.value;

    setRenderedClient(
      clientsProcessed.filter(client =>
        Array.from(client.linkedUsers.split(', ')).some(
          user => user === chosenUser
        )
      )
    );

    setRenderedProducts(
      productsProcessed.filter(product =>
        Array.from(product.availableToUsers.split(', ')).some(
          user => user === chosenUser
        )
      )
    );

    setUserIsChosen(true);
  };

  const addUserButtonHandler = () => {
    setShowAddForm(true);
  };

  const editUserButtonHandler = () => {
    setShowEditForm(true);
  };

  const hideModalHandler = () => {
    if (showAddForm) setShowAddForm(false);
    if (showEditForm) setShowEditForm(false);
    if (showDeleteNotification) setShowDeleteNotification(false);
  };

  const deleteUserButtonHandler = () => {
    console.log(userRef.current.value);
    dispatch(stateActions.removeUser(userRef.current.value));
    // ⬇ отправка обновленного состояния с удаленным пользователем в базу.
    setFormIsSubmitted(true);
    setShowDeleteNotification(false);
  };

  const deleteNotificationHandler = () => {
    setShowDeleteNotification(true);
  };

  return (
    <Fragment>
      {showAddForm && (
        <AddUserForm
          onHideModal={hideModalHandler}
          clientsRaw={fetchedClients}
          clients={clientsProcessed}
          products={productsProcessed}
          setFormIsSubmitted={setFormIsSubmitted}
        />
      )}
      {showEditForm && (
        <EditUserForm
          onHideModal={hideModalHandler}
          chosenUser={userRef.current.value}
          clients={clientsProcessed}
          clientsRaw={fetchedClients}
          users={fetchedUsers}
          products={productsProcessed}
          setFormIsSubmitted={setFormIsSubmitted}
          setStateChanged={props.stateChanged}
        />
      )}
      {showDeleteNotification && (
        <DeleteNotification
          name={fetchedUsers[userRef.current.value].name}
          onHideModal={hideModalHandler}
          deleteHandler={deleteUserButtonHandler}
        />
      )}
      <div className={classes.container}>
        <main className={classes.lists}>
          <div className={classes.row}>
            <form onSubmit={onSubmitHandler}>
              <label htmlFor='user' className={classes.description}>
                Выберите пользователя:
              </label>
              <select ref={userRef} name='users' id='user'>
                {usersSelector}
              </select>
              <button type='submit'>Выбрать</button>
            </form>
          </div>
          <div className={classes.row}>
            {userIsChosen && (
              <span className={classes.description}>Связанный клиент</span>
            )}
            {userIsChosen && <List data={renderedClient} />}
          </div>
          <div className={classes.row}>
            {userIsChosen && (
              <span className={classes.description}>Доступные продукты</span>
            )}
            {userIsChosen && <List data={renderedProducts} />}
          </div>
        </main>
        {userIsChosen && (
          <div className={classes.buttons}>
            <button onClick={addUserButtonHandler} className={classes.add}>
              Добавить
            </button>
            <button onClick={editUserButtonHandler} className={classes.edit}>
              Редактировать
            </button>
            <button
              onClick={deleteNotificationHandler}
              className={classes.delete}>
              Удалить
            </button>
          </div>
        )}
      </div>
      <Outlet />
    </Fragment>
  );
};

export default UsersMenu;
