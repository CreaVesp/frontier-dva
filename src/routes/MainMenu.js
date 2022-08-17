import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { connect } from 'dva';

import List from '../components/Lists/List';

import classes from './Menu.module.css';

const MainMenu = (fetchData, state) => {
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.lists}>
          <div className={classes.row}>
            <span className={classes.description}>Наши клиенты</span>
            <List data={state.clients} />
          </div>
          <div className={classes.row}>
            <span className={classes.description}>Список пользователей</span>
            <List data={state.users} />
          </div>
          <div className={classes.row}>
            <span className={classes.description}>Наши продукты</span>
            <List data={state.products} />
          </div>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

function mapStateToProps(state) {
  return state.main;
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData(state) {
      dispatch({ type: 'main/fetchData', state });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
