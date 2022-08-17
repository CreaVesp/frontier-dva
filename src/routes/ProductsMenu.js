import { Fragment, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stateActions } from '../store/common-state';
import { sendCommonData } from '../store/common-actions';

import List from '../components/Lists/List';
import AddProductForm from '../components/UI/Forms/AddProductForm';
import EditProductForm from '../components/UI/Forms/EditProductForm';
import DeleteNotification from '../components/UI/DeleteNotification';
import classes from './Menu.module.css';
import { Outlet } from 'react-router-dom';

const ProductsMenu = props => {
  const [productIsChosen, setProductIsChosen] = useState(false);
  const [renderedClients, setRenderedClients] = useState([]);
  const [renderedUsers, setRenderedUsers] = useState([]);
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
      setProductIsChosen(false);
    }
  }, [formIsSubmitted, dispatch, commonState]);

  const productRef = useRef('');

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

  const productsSelector = productsProcessed.map(product => (
    <option key={product.id} value={product.id}>
      {product.name}
    </option>
  ));

  const onSubmitHandler = e => {
    e.preventDefault();
    const chosenProduct = productRef.current.value;

    setRenderedClients(
      clientsProcessed.filter(client =>
        Array.from(client.availableProducts.split(', ')).some(
          product => product === chosenProduct
        )
      )
    );

    setRenderedUsers(
      usersProcessed.filter(user =>
        Array.from(user.availableProducts.split(', ')).some(
          product => product === chosenProduct
        )
      )
    );

    setProductIsChosen(true);
  };

  const addProductButtonHandler = () => {
    setShowAddForm(true);
  };

  const editProductButtonHandler = () => {
    setShowEditForm(true);
  };

  const hideModalHandler = () => {
    if (showAddForm) setShowAddForm(false);
    if (showEditForm) setShowEditForm(false);
    if (showDeleteNotification) setShowDeleteNotification(false);
  };

  const deleteProductButtonHandler = () => {
    console.log(productRef.current.value);
    dispatch(stateActions.removeProduct(productRef.current.value));
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
        <AddProductForm
          onHideModal={hideModalHandler}
          clientsRaw={fetchedClients}
          clients={clientsProcessed}
          users={usersProcessed}
          setFormIsSubmitted={setFormIsSubmitted}
        />
      )}
      {showEditForm && (
        <EditProductForm
          onHideModal={hideModalHandler}
          chosenProduct={productRef.current.value}
          clients={clientsProcessed}
          clientsRaw={fetchedClients}
          users={usersProcessed}
          products={fetchedProducts}
          setFormIsSubmitted={setFormIsSubmitted}
          setStateChanged={props.stateChanged}
        />
      )}
      {showDeleteNotification && (
        <DeleteNotification
          name={fetchedProducts[productRef.current.value].name}
          onHideModal={hideModalHandler}
          deleteHandler={deleteProductButtonHandler}
        />
      )}
      <div className={classes.container}>
        <main className={classes.lists}>
          <div className={classes.row}>
            <form onSubmit={onSubmitHandler}>
              <label htmlFor='user' className={classes.description}>
                Выберите продукт:
              </label>
              <select ref={productRef} name='product' id='product'>
                {productsSelector}
              </select>
              <button type='submit'>Выбрать</button>
            </form>
          </div>
          <div className={classes.row}>
            {productIsChosen && (
              <span className={classes.description}>Связанные клиенты</span>
            )}
            {productIsChosen && <List data={renderedClients} />}
          </div>
          <div className={classes.row}>
            {productIsChosen && (
              <span className={classes.description}>
                Связанные пользователи
              </span>
            )}
            {productIsChosen && <List data={renderedUsers} />}
          </div>
        </main>
        {productIsChosen && (
          <div className={classes.buttons}>
            <button className={classes.add} onClick={addProductButtonHandler}>
              Добавить
            </button>
            <button className={classes.edit} onClick={editProductButtonHandler}>
              Редактировать
            </button>
            <button
              className={classes.delete}
              onClick={deleteNotificationHandler}>
              Удалить
            </button>
          </div>
        )}
      </div>
      <Outlet />
    </Fragment>
  );
};

export default ProductsMenu;
