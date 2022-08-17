import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import makeArray from '../helper-functions/makeProperArray';

import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import classes from './Menu.module.css';

const InspectModal = props => {
  const clientsState = useSelector(state => state.commonState.clients);
  const usersState = useSelector(state => state.commonState.users);
  const productsState = useSelector(state => state.commonState.products);

  const params = useParams();
  const chosenEntity = params.entityId;

  let renderedInfo = '';
  if (chosenEntity.startsWith('c')) {
    renderedInfo = (
      <div className={classes.lists}>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Клиент</span>
          <span className={classes.inspectName}>
            {clientsState[chosenEntity].name}
          </span>
        </div>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Связанные пользователи</span>
          <ul className={classes.inspectList}>
            {clientsState[chosenEntity].linkedUsers.length > 0 ? (
              makeArray(clientsState[chosenEntity].linkedUsers).map(user => (
                <li
                  className={classes.inspectListItem}
                  key={usersState[user].id}>
                  {usersState[user].name}
                </li>
              ))
            ) : (
              <li className={classes.inspectListItem}>
                Нет связанных пользователей
              </li>
            )}
          </ul>
        </div>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Доступные продукты</span>
          <ul className={classes.inspectList}>
            {clientsState[chosenEntity].availableProducts.length > 1 ? (
              makeArray(clientsState[chosenEntity].availableProducts).map(
                product => (
                  <li
                    className={classes.inspectListItem}
                    key={productsState[product].id}>
                    {productsState[product].name}
                  </li>
                )
              )
            ) : (
              <li className={classes.inspectListItem}>
                Нет доступных продуктов
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
  if (chosenEntity.startsWith('u')) {
    renderedInfo = (
      <div className={classes.lists}>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Пользователь</span>
          <span className={classes.inspectName}>
            {usersState[chosenEntity].name}
          </span>
        </div>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Связанные клиенты</span>
          <ul className={classes.inspectList}>
            {usersState[chosenEntity].linkedClients.length > 1 ? (
              makeArray(usersState[chosenEntity].linkedClients).map(client => (
                <li
                  className={classes.inspectListItem}
                  key={clientsState[client].id}>
                  {clientsState[client].name}
                </li>
              ))
            ) : (
              <li className={classes.inspectListItem}>
                Нет связанных клиентов
              </li>
            )}
          </ul>
        </div>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Доступные продукты</span>
          <ul className={classes.inspectList}>
            {usersState[chosenEntity].availableProducts.length > 1 ? (
              makeArray(usersState[chosenEntity].availableProducts).map(
                product => (
                  <li
                    className={classes.inspectListItem}
                    key={productsState[product].id}>
                    {productsState[product].name}
                  </li>
                )
              )
            ) : (
              <li className={classes.inspectListItem}>
                Нет доступных продуктов
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
  if (chosenEntity.startsWith('p')) {
    renderedInfo = (
      <div className={classes.lists}>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Продукт</span>
          <span className={classes.inspectName}>
            {productsState[chosenEntity].name}
          </span>
        </div>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Связанные клиенты</span>
          <ul className={classes.inspectList}>
            {productsState[chosenEntity].availableToClients.length > 1 ? (
              makeArray(productsState[chosenEntity].availableToClients).map(
                client => (
                  <li
                    className={classes.inspectListItem}
                    key={clientsState[client].id}>
                    {clientsState[client].name}
                  </li>
                )
              )
            ) : (
              <li className={classes.inspectListItem}>Не доступен клиентам</li>
            )}
          </ul>
        </div>
        <div className={classes.inspectRow}>
          <span className={classes.description}>Связанные пользователи</span>
          <ul className={classes.inspectList}>
            {productsState[chosenEntity].availableToUsers.length > 1 ? (
              makeArray(productsState[chosenEntity].availableToUsers).map(
                user => (
                  <li
                    className={classes.inspectListItem}
                    key={usersState[user].id}>
                    {usersState[user].name}
                  </li>
                )
              )
            ) : (
              <li className={classes.inspectListItem}>
                Не доступен пользователям
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <Modal onHideModal={props.close}>
      <div className={classes.container}>
        {renderedInfo}
        <div className={classes.inspectButtons}>
          <Button onClick={props.close}>Назад</Button>
        </div>
      </div>
    </Modal>
  );
};

export default InspectModal;
