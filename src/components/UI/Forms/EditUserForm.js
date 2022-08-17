import { Fragment, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { stateActions } from '../../../store/common-state';
import makeArray from '../../../helper-functions/makeProperArray';
import splitString from '../../../helper-functions/splitString';
import Modal from '../Modal';

import './Form.css';

const EditUserForm = props => {
  const dispatch = useDispatch();

  const clients = props.clients;
  const clientsRaw = props.clientsRaw;
  const products = props.products;
  const users = props.users;
  const userNameRef = useRef('');
  const editedUser = users[props.chosenUser];
  const edUsLinkedClients = Array.from(editedUser.linkedClients.split(', '));
  const edUsAvProds = Array.from(editedUser.availableProducts.split(', '));

  // ⬇ Local states
  const [enteredName, setEnteredName] = useState('');
  const [clientIsChecked, setClientIsChecked] = useState(edUsLinkedClients);
  const [productIsChecked, setProductIsChecked] = useState(edUsAvProds);
  const [incorrectProducts, setIncorrectProducts] = useState(false);

  // ⬇ Handlers
  useEffect(() => {
    setEnteredName(userNameRef.current.value);
  }, [userNameRef]);

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

  const productCheckedHandler = e => {
    let checkedProducts = productIsChecked;
    if (e.target.checked) {
      checkedProducts.push(e.target.value);
    } else {
      checkedProducts.splice(productIsChecked.indexOf(e.target.value), 1);
    }
    // ⬇ Проверка, доступны ли отмеченные продукты выбранным клиентам. Если нет, то вывод предупреждения.
    const listOfAvProducts = [];
    for (const client of clientIsChecked) {
      listOfAvProducts.push(splitString(clientsRaw[client].availableProducts));
    }

    if (
      !listOfAvProducts.flat().some(prod => prod === e.target.value) &&
      e.target.checked
    ) {
      document
        .getElementById(`prod-el${e.target.value}`)
        .classList.add('error');
    } else {
      document
        .getElementById(`prod-el${e.target.value}`)
        .classList.remove('error');
    }
    const unavailableProducts = checkedProducts.some(
      product => !listOfAvProducts.flat().some(prod => prod === product)
    );
    if (unavailableProducts) {
      setIncorrectProducts(true);
    } else {
      setIncorrectProducts(false);
    }
    setProductIsChecked(checkedProducts);
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    const editedUserData = {
      name: enteredName,
      linkedClients:
        clientIsChecked.length > 1
          ? clientIsChecked.join(', ')
          : clientIsChecked.join(),
      availableProducts:
        productIsChecked.length > 1
          ? productIsChecked.join(', ')
          : productIsChecked.join(),
      id: editedUser.id,
    };
    // ⬇ валидация здесь, потому что при вводе состояния валидности формы, она улетает в infinite re-render.
    const listOfAvProducts = [];
    for (const client of clientIsChecked) {
      listOfAvProducts.push(splitString(clientsRaw[client].availableProducts));
    }
    const validProducts = productIsChecked.every(product =>
      listOfAvProducts.flat().some(prod => prod === product)
    );
    if (!validProducts) {
      setIncorrectProducts(true);
    }
    if (enteredName && clientIsChecked.length > 0 && validProducts) {
      console.log(editedUserData);
      dispatch(stateActions.editUser(editedUserData));
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
        defaultChecked={makeArray(editedUser.linkedClients).some(
          cl => cl === client.id
        )}
      />
      <label htmlFor='user'>{client.name}</label>
    </div>
  ));

  const productsSelector = products.map((product, index) => (
    <div className='checkbox' key={index} id={`prod-el${product.id}`}>
      <input
        type='checkbox'
        id={`product${product.id}`}
        name='product'
        value={product.id}
        onChange={productCheckedHandler}
        defaultChecked={makeArray(editedUser.availableProducts).some(
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
              Наименование пользователя
            </label>
            <input
              ref={userNameRef}
              defaultValue={editedUser.name}
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
              Доступные продукты
            </label>
            {productsSelector}
          </div>
        </form>
        {incorrectProducts && (
          <span className='error-message'>
            Выбранный продукт недоступен указанным клиентам
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

export default EditUserForm;
