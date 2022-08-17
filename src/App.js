import React from 'react';
import { Route, Routes, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { connect } from 'dva';

import Header from './components/Header';
import MainMenu from './routes/MainMenu';
import ClientsMenu from './routes/ClientsMenu';
import UsersMenu from './routes/UsersMenu';
import ProductsMenu from './routes/ProductsMenu';
import InspectModal from './routes/InspectModal';

function App(fetchData, state) {
  const navigate = useNavigate();

  // ⬇ InspectModal close
  const closeInspect = () => {
    navigate(-1);
  };

  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/' element={<Navigate replace to='/overview' />} />
        <Route path='/overview' element={<MainMenu />}>
          <Route path='inspect'>
            <Route
              path=':entityId'
              element={<InspectModal close={closeInspect} />}
            />
          </Route>
        </Route>
        <Route path='/clients' element={<ClientsMenu />}>
          <Route path='inspect'>
            <Route
              path=':entityId'
              element={<InspectModal close={closeInspect} />}
            />
          </Route>
        </Route>
        <Route path='/users' element={<UsersMenu />}>
          <Route path='inspect'>
            <Route
              path=':entityId'
              element={<InspectModal close={closeInspect} />}
            />
          </Route>
        </Route>
        <Route path='/products' element={<ProductsMenu />}>
          <Route path='inspect'>
            <Route
              path=':entityId'
              element={<InspectModal close={closeInspect} />}
            />
          </Route>
        </Route>
      </Routes>
      <Outlet />
    </div>
  );
}

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
