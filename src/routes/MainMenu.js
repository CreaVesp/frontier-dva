import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import List from '../components/Lists/List';

import classes from './Menu.module.css';

const MainMenu = props => {
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.lists}>
          <div className={classes.row}>
            <span className={classes.description}>Наши клиенты</span>
            <List data={props.clients} />
          </div>
          <div className={classes.row}>
            <span className={classes.description}>Список пользователей</span>
            <List data={props.users} />
          </div>
          <div className={classes.row}>
            <span className={classes.description}>Наши продукты</span>
            <List data={props.products} />
          </div>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default MainMenu;
