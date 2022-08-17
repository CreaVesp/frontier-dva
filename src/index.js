import React from 'react';
import dva from 'dva';

import { createBrowserHistory } from 'history';

import './index.css';

const history = createBrowserHistory();
const app = dva({ history });
app.model(require('./models/mainPageModel'));
app.router(require('./router'));
app.start('#root');
