import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { stateActions } from '../../../store/common-state';
import splitString from '../../../helper-functions/splitString';
import Modal from '../Modal';

import './Form.css';

const AddProductForm = props => {
  const dispatch = useDispatch();
  const [enteredName, setEnteredName] = useState('');
  const [clientIsChecked, setClientIsChecked] = useState([]);
  const [userIsChecked, setUserIsChecked] = useState([]);
  const [incorrectUsers, setIncorrectUsers] = useState(false);

  const clients = props.clients;
  const clientsRaw = props.clientsRaw;
  const users = props.users;

  // ⬇ Handlers
  const nameHandler = e => {
    setEnteredName(e.target.value);
  };

  const clientCheckedHandler = e => {
    let checkedClients = clientIsChecked;
    if (e.target.checked) {
      checkedClients.push(e.target.value);
    } else {
      checkedClients.splice(clientIsChecked.indexOf(e.target.value), 1);
    }
    setClientIsChecked(checkedClients);
  };

  const userCheckedHandler = e => {
    let checkedUsers = userIsChecked;
    if (e.target.checked) {
      checkedUsers.push(e.target.value);
    } else {
      checkedUsers.splice(userIsChecked.indexOf(e.target.value), 1);
    }
    // ⬇ Проверка, привязаны ли отмеченные пользователи к клиентам, которым доступен продукт. Если нет, то вывод предупреждения.
    const listOfLinkedUsers = [];
    for (const client of clientIsChecked) {
      listOfLinkedUsers.push(splitString(clientsRaw[client].linkedUsers));
    }

    if (
      !listOfLinkedUsers.flat().some(user => user === e.target.value) &&
      e.target.checked
    ) {
      document
        .getElementById(`user-el${e.target.value}`)
        .classList.add('error');
    } else {
      document
        .getElementById(`user-el${e.target.value}`)
        .classList.remove('error');
    }
    const unlinkedUsers = checkedUsers.some(
      user => !listOfLinkedUsers.flat().some(u => u === user)
    );
    if (unlinkedUsers) {
      setIncorrectUsers(true);
    } else {
      setIncorrectUsers(false);
    }
    setUserIsChecked(checkedUsers);
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    const newProduct = {
      name: enteredName,
      availableToClients:
        clientIsChecked.length > 1
          ? clientIsChecked.join(', ')
          : clientIsChecked.join(),
      availableToUsers:
        userIsChecked.length > 1
          ? userIsChecked.join(', ')
          : userIsChecked.join(),
      id: `p${Math.trunc(Math.random() * 1000)}`,
    };
    // ⬇ валидация здесь, потому что при вводе состояния валидности формы, она улетает в infinite re-render.
    const listOfLinkedUsers = [];
    for (const client of clientIsChecked) {
      listOfLinkedUsers.push(splitString(clientsRaw[client].linkedUsers));
    }
    const validUsers = userIsChecked.every(user =>
      listOfLinkedUsers.flat().some(u => u === user)
    );
    if (!validUsers) {
      setIncorrectUsers(true);
    }
    if (enteredName && validUsers) {
      console.log(newProduct);
      dispatch(stateActions.addProduct(newProduct));
      props.setFormIsSubmitted(true);
      props.onHideModal();
    }
  };

  // ⬇ Lists of checkboxes
  const clientsSelector = clients.map((client, index) => (
    <div className='checkbox' key={index}>
      <input
        type='checkbox'
        id={`client${client.id}`}
        name='client'
        value={client.id}
        onChange={clientCheckedHandler}
      />
      <label htmlFor='user'>{client.name}</label>
    </div>
  ));

  const usersSelector = users.map((user, index) => (
    <div className='checkbox' key={index} id={`user-el${user.id}`}>
      <input
        type='checkbox'
        id={`user${user.id}`}
        name='user'
        value={user.id}
        onChange={userCheckedHandler}
      />
      <label htmlFor='user'>{user.name}</label>
    </div>
  ));

  return (
    <Modal onHideModal={props.onHideModal}>
      <Fragment>
        <form className='form'>
          <div className='input'>
            <label htmlFor='name' className='description'>
              Название продукта
            </label>
            <input
              className='input-text'
              onBlur={nameHandler}
              id='name'></input>
          </div>
          <div className='input'>
            <label htmlFor='users' className='description'>
              Выберите клиентов
            </label>
            {clientsSelector}
          </div>
          <div className='input'>
            <label htmlFor='products' className='description'>
              Выберите пользователей
            </label>
            {usersSelector}
          </div>
        </form>
        {incorrectUsers && (
          <span className='error-message'>
            Выбранный пользователь не связан с указанными клиентами
          </span>
        )}
        <div className='buttons-panel'>
          <button
            onClick={onSubmitHandler}
            type='submit'
            className='btn btn--submit'>
            Подтвердить
          </button>
          <button onClick={props.onHideModal} className='btn btn--cancel'>
            Отмена
          </button>
        </div>
      </Fragment>
    </Modal>
  );
};

export default AddProductForm;
