import dva from 'dva';
export default {
  namespace: 'main',
  state: { clients: [], users: [], products: [] },
  reducers: {
    replaceAll(state, { payload: data }) {
      return { ...state, data };
    },
  },
  effects: {
    *fetchData({ call, put }) {
      const data = yield call(fetchCommonData);
      yield put({ type: 'replaceAll', payload: data });
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
