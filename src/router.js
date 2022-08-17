import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
  const MainMenu = dynamic({
    app,
    component: () => import('./routes/MainMenu'),
  });
  const ClientsMenu = dynamic({
    app,
    component: () => import('./routes/ClientsMenu'),
  });
  const UsersMenu = dynamic({
    app,
    component: () => import('./routes/UsersMenu'),
  });
  const ProductsMenu = dynamic({
    app,
    component: () => import('./routes/ProductsMenu'),
  });
  return (
    <Router history={history}>
      <Switch>
        <Route path='/'>
          <Redirect to='/overview' />
        </Route>
        <Route path='/overview' component={MainMenu} />
        <Route path='/clients' component={ClientsMenu} />
        <Route path='/users' component={UsersMenu} />
        <Route path='/products' component={ProductsMenu} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
