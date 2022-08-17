import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import MainMenu from './routes/MainMenu';
import ClientsMenu from './routes/ClientsMenu';
import UsersMenu from './routes/UsersMenu';
import ProductsMenu from './routes/ProductsMenu';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path='/'>
        <Redirect to='/overview' />
      </Route>
      <Route path='/overview' component={<MainMenu />} />
      <Route path='/clients' component={<ClientsMenu />} />
      <Route path='/users' component={<UsersMenu />} />
      <Route path='/products' component={<ProductsMenu />} />
    </Router>
  );
}

export default RouterConfig;
