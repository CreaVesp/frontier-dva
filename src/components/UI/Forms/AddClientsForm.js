import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { stateActions } from '../../../store/common-state';
import Modal from '../Modal';

import './Form.css';

const AddClientsForm = props => {
  const dispatch = useDispatch();
  const [enteredName, setEnteredName] = useState('');
  const [userIsChecked, setUserIsChecked] = useState([]);
  const [productIsChecked, setProductIsChecked] = useState([]);

  const users = props.users;
  const products = props.products;

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
    const newClient = {
      name: enteredName,
      linkedUsers:
        userIsChecked.length > 1
          ? userIsChecked.join(', ')
          : userIsChecked.toString(),
      availableProducts:
        productIsChecked.length > 1
          ? productIsChecked.join(', ')
          : productIsChecked.toString(),
      id: `c${Math.trunc(Math.random() * 1000)}`,
    };
    if (enteredName) {
      dispatch(stateActions.addClient(newClient));
      console.log(newClient);
    }
    props.setFormIsSubmitted(true);
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
              className='input-text'
              onBlur={nameHandler}
              id='name'></input>
          </div>
          <div className='input'>
            <label htmlFor='users' className='description'>
              Привяжите пользователей
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

export default AddClientsForm;
