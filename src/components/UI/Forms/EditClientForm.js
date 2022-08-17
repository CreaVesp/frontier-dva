import { Fragment, useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { stateActions } from '../../../store/common-state';
import makeArray from '../../../helper-functions/makeProperArray';
import Modal from '../Modal';

import './Form.css';

const EditClientsForm = props => {
  const dispatch = useDispatch();
  const clients = props.clients;
  const users = props.users;
  const products = props.products;
  const clientNameRef = useRef('');
  const editedClient = clients[props.chosenClient];
  const linkedUsersOfChosenClient = Array.from(
    editedClient.linkedUsers.split(', ')
  );
  const avProdsOfChosenClient = Array.from(
    editedClient.availableProducts.split(', ')
  );

  // ⬇ Local states
  const [enteredName, setEnteredName] = useState('');
  const [userIsChecked, setUserIsChecked] = useState(linkedUsersOfChosenClient);
  const [productIsChecked, setProductIsChecked] = useState(
    avProdsOfChosenClient
  );

  // ⬇ сохраняет текущее имя клиента, если оно не было обновлено.
  useEffect(() => {
    setEnteredName(clientNameRef.current.value);
  }, [clientNameRef]);

  // ⬇ Handlers

  const nameHandler = e => {
    setEnteredName(e.target.value);
  };

  const userCheckedHandler = e => {
    let checkedUsers = userIsChecked;
    if (e.target.checked) {
      checkedUsers.push(e.target.value);
    } else {
      checkedUsers.splice(userIsChecked.indexOf(e.target.value), 1);
    }
    setUserIsChecked(checkedUsers);
  };

  const productCheckedHandler = e => {
    let checkedProducts = productIsChecked;
    if (e.target.checked) {
      checkedProducts.push(e.target.value);
    } else {
      checkedProducts.splice(productIsChecked.indexOf(e.target.value), 1);
    }
    setProductIsChecked(checkedProducts);
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    const editedClientData = {
      name: enteredName,
      linkedUsers:
        userIsChecked.length > 1
          ? userIsChecked.join(', ')
          : userIsChecked.toString(),
      availableProducts:
        productIsChecked.length > 1
          ? productIsChecked.join(', ')
          : productIsChecked.toString(),
      id: editedClient.id,
    };

    console.log(editedClientData);
    dispatch(stateActions.editClient(editedClientData));
    props.setFormIsSubmitted(true);
    props.setStateChanged(true);
    props.onHideModal();
  };

  // ⬇ Lists of checkboxes
  const usersSelector = users.map((user, index) => (
    <div className='checkbox' key={index}>
      <input
        type='checkbox'
        id='user'
        name='user'
        value={user.id}
        onChange={userCheckedHandler}
        defaultChecked={makeArray(editedClient.linkedUsers).some(
          u => u === user.id
        )}
      />
      <label htmlFor='user'>{user.name}</label>
    </div>
  ));

  const productsSelector = products.map((product, index) => (
    <div className='checkbox' key={index}>
      <input
        type='checkbox'
        id='product'
        name='product'
        value={product.id}
        onChange={productCheckedHandler}
        defaultChecked={makeArray(editedClient.availableProducts).some(
          prod => prod === product.id
        )}
      />
      <label htmlFor='product'>{product.name}</label>
    </div>
  ));

  return (
    <Modal onHideModal={props.onHideModal}>
      <Fragment>
        <form className='form'>
          <div className='input'>
            <label htmlFor='name' className='description'>
              Наименование клиента
            </label>
            <input
              ref={clientNameRef}
              className='input-text'
              onBlur={nameHandler}
              id='name'
              defaultValue={editedClient.name}></input>
          </div>
          <div className='input'>
            <label htmlFor='users' className='description'>
              Связанные пользователи
            </label>
            {usersSelector}
          </div>
          <div className='input'>
            <label htmlFor='products' className='description'>
              Доступные продукты
            </label>
            {productsSelector}
          </div>
        </form>
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

export default EditClientsForm;
