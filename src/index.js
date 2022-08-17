import React from 'react';
import dva from 'dva';
import mainPageModel from './models/mainPageModel';
import RouterConfig from './router';
import { createBrowserHistory } from 'history';

import './index.css';

const history = createBrowserHistory();
const app = dva({ history });
app.model(mainPageModel);
app.router(RouterConfig);
app.start('#root');
