import dva from 'dva';
export const mainModel = {
  namespace: 'main',
  state: { clients: [], users: [], products: [] },
  reducers: {
    replaceAll(state, action) {
      state.clients = action.payload.clients;
      state.users = action.payload.users;
      state.products = action.payload.products;
    },
  },
  effects: {
    *fetchData({ put }) {
      yield put({ type: 'replaceAll', payload: fetchCommonData });
    },
  },
};

const fetchCommonData = async () => {
  const response = await fetch(
    'https://react-http-54b71-default-rtdb.europe-west1.firebasedatabase.app/frontier-project.json'
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Could not fetch the data.');
  }

  return data;
};
