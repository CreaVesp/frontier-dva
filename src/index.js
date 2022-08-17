import React from 'react';
import dva from 'dva';
import { Router, Route } from 'dva/router';
import App from './App';
import { createBrowserHistory } from 'history';

import './index.css';

const history = createBrowserHistory();
const app = dva({ history });
app.model(require('./models/mainPageModel'));
app.router(({ history }) => {
  return (
    <Router history={history}>
      <Route path='/' component={App} />
    </Router>
  );
});
app.start('#root');
