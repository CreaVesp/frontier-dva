import { NavLink } from 'react-router-dom';
import classes from './Header.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.navigation}>
        <ul>
          <li>
            <NavLink
              to='/overview'
              className={navData => (navData.isActive ? classes.active : '')}>
              Обзор
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/clients'
              className={navData => (navData.isActive ? classes.active : '')}>
              Клиенты
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/users'
              className={navData => (navData.isActive ? classes.active : '')}>
              Пользователи
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/products'
              className={navData => (navData.isActive ? classes.active : '')}>
              Продукты
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
