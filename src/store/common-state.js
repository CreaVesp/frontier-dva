import { createSlice } from '@reduxjs/toolkit';
import makeArray from '../helper-functions/makeProperArray';
import makeString from '../helper-functions/makeProperString';
import joinArray from '../helper-functions/joinArray';

const stateSlice = createSlice({
  name: 'commonState',
  initialState: { clients: [], users: [], products: [] },
  reducers: {
    replaceAll(state, action) {
      state.clients = action.payload.clients;
      state.users = action.payload.users;
      state.products = action.payload.products;
    },
    /////////////////////////////////////////////////////////
    // ⬇ методы для клиентов
    // ⬇ добавление клиента
    addClient(state, action) {
      const newClient = action.payload;
      // ⬇ проверка на то, не совпал ли новый рандомный айдишник с каким-то из существующих
      const extractedClients = [];
      for (const client of Object.values(state.clients)) {
        extractedClients.push(client);
      }
      const existingClient = extractedClients.find(
        client => client.id === newClient.id
      );
      const checkedClientID = existingClient
        ? `c${Math.round(Math.random() * 100000)}`
        : newClient.id;

      // ⬇ обновление списка клиентов уже после проверки на повтор айдишника
      state.clients[checkedClientID] = {
        id: checkedClientID,
        name: newClient.name,
        linkedUsers: newClient.linkedUsers,
        availableProducts: newClient.availableProducts,
      };

      // ⬇ добавление зависимостей нового клиента к связанным с ним юзерам
      for (const user of Object.values(state.users)) {
        const newClLinkUs = makeArray(newClient.linkedUsers);
        console.log('~ newClLinkUs', newClLinkUs);
        if (newClLinkUs.some(u => u === user.id)) {
          user.linkedClients = makeString(user.linkedClients, newClient.id);
          console.log('~ user.linkedClients', user.linkedClients);
        }
      }

      // ⬇ добавление зависимостей продуктам
      for (const product of Object.values(state.products)) {
        const newClAvProds = makeArray(newClient.availableProducts);
        console.log('~ newClAvProds', newClAvProds);
        if (newClAvProds.some(prod => prod === product.id)) {
          product.availableToClients = makeString(
            product.availableToClients,
            newClient.id
          );
        }
      }
    },

    ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    // ⬇ редактирование клиента
    editClient(state, action) {
      const editedClient = action.payload;

      // ⬇ переменные, необходимые для дальнейших фильтраций
      const edClNewAvProds = makeArray(editedClient.availableProducts);
      const edClPrevAvProds = makeArray(
        state.clients[editedClient.id].availableProducts
      );
      const edClNewLinkedUsers = makeArray(editedClient.linkedUsers);
      const edClPrevLinkedUsers = makeArray(
        state.clients[editedClient.id].linkedUsers
      );

      // ⬇ Обработка пользователей, привязанных к редактируемому клиенту
      for (const user of Object.values(state.users)) {
        /* ⬇ удалить продукты, которые были доступны юзеру от редактируемого клиента,
        если юзер больше не принадлежит этому клиенту */
        const userAvProds = makeArray(user.availableProducts);

        const intersectedProducts = userAvProds.some(product =>
          edClPrevAvProds.some(prod => prod === product)
        );
        const usLinkCls = makeArray(user.linkedClients);
        const edClLinkUsers = makeArray(editedClient.linkedUsers);

        // ⬇ если пользователь был отвязан от клиента
        if (
          intersectedProducts &&
          usLinkCls.some(client => client === editedClient.id) &&
          !edClLinkUsers.some(u => u === user.id)
        ) {
          const updatedAvProds = userAvProds.filter(
            product => !edClPrevAvProds.some(prod => prod === product)
          );
          user.availableProducts = joinArray(updatedAvProds);
        }
        // ⬇ если пользователь не был отвязан от клиента, но у клиента изменились доступные продукты
        if (
          intersectedProducts &&
          usLinkCls.some(client => client === editedClient.id) &&
          edClLinkUsers.some(u => u === user.id)
        ) {
          const updatedAvProds = userAvProds.filter(product =>
            edClNewAvProds.some(prod => prod === product)
          );
          user.availableProducts = joinArray(updatedAvProds);
        }

        // ⬇ если user не был связан с клиентом, но теперь клиента привязали к этому пользователю
        if (
          !usLinkCls.some(client => client === editedClient.id) &&
          edClLinkUsers.some(u => u === user.id)
        ) {
          /* ⬇ здесь такой неадекватный код потому что при вызове push прямо в const updatedLinkedClients он почему-то
          возвращал длину массива вместо самого массива... Поэтому пришлось так все разделить вместо одной цепочки методов. */
          const updatedLinkedClients = makeArray(user.linkedClients);

          updatedLinkedClients.push(editedClient.id);
          user.linkedClients = joinArray(updatedLinkedClients);
        }
        // ⬇ удалить саму связь клиент/пользователь, если после редактирования данный user больше не принадлежит клиенту
        if (
          usLinkCls.some(client => client === editedClient.id) &&
          !edClLinkUsers.some(u => u === user.id)
        ) {
          const updatedLinkedClients = usLinkCls.filter(
            client => client !== editedClient.id
          );
          console.log('~ updatedLinkedClients FILTERED', updatedLinkedClients);
          user.linkedClients = joinArray(updatedLinkedClients);
        }
      }

      // ⬇ Обработка продуктов, привязанных к редактируемому клиенту
      for (const product of Object.values(state.products)) {
        const prodAvToCls = makeArray(product.availableToClients);

        // ⬇ если продукт ранее не был, а теперь привязан к клиенту
        if (
          !prodAvToCls.some(client => client === editedClient.id) &&
          edClNewAvProds.some(prod => prod === product.id)
        ) {
          const updatedAvailableToClients = [...prodAvToCls];
          updatedAvailableToClients.push(editedClient.id);
          product.availableToClients = joinArray(updatedAvailableToClients);
        }
        // ⬇ если ранее был, а теперь не привязан
        if (
          prodAvToCls.some(client => client === editedClient.id) &&
          !edClNewAvProds.some(prod => prod === product.id)
        ) {
          const updatedAvailableToClients = prodAvToCls.filter(
            client => client !== editedClient.id
          );
          console.log('~ updatedAvailableToClients', updatedAvailableToClients);
          product.availableToClients = joinArray(updatedAvailableToClients);
        }
        // ⬇ если user был отвязан у клиента - удалить доступность продукта юзеру
        const prodAvToUsers = makeArray(product.availableToUsers);

        const intersectedUsers = prodAvToUsers.some(user =>
          edClPrevLinkedUsers.some(u => u === user)
        );

        if (intersectedUsers) {
          const updatedProdAvToUsers = prodAvToUsers.filter(
            user => !edClNewLinkedUsers.some(u => u === user)
          );
          product.availableToUsers = joinArray(updatedProdAvToUsers);
        }
      }

      // ⬇ конечное обновление клиента в состоянии для отправки в базу
      state.clients[editedClient.id] = editedClient;
    },

    ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    // ⬇ удаление клиента

    removeClient(state, action) {
      const removableClientID = action.payload;
      // ⬇ переменные, необходимые для дальнейших фильтраций
      const removedClAvProds = makeArray(
        state.clients[removableClientID].availableProducts
      );

      const removedClLinkedUsers = makeArray(
        state.clients[removableClientID].linkedUsers
      );

      ///////////////////////////////////////////
      // ⬇ удаление зависимостей у пользователей
      const users = [];
      for (const user of Object.values(state.users)) {
        users.push(user);
      }

      const newUsersState = {};

      for (const user of Object.values(users)) {
        // ⬇ удалить продукты, которые были доступны юзеру от удаляемого клиента, но сохранить продукты оставшегося клиента
        const userAvProds = makeArray(user.availableProducts);
        const userLinkCls = makeArray(user.linkedClients);

        const intersectedProducts =
          userAvProds.some(product =>
            removedClAvProds.some(p => p === product)
          ) && userLinkCls.some(cl => cl === removableClientID);

        if (intersectedProducts) {
          const leftUserAvProds = userAvProds.filter(
            product => !removedClAvProds.some(p => p === product)
          );

          user.availableProducts = joinArray(leftUserAvProds);
        }

        // ⬇ отвязка от удаленного клиента

        if (userLinkCls.some(client => client === removableClientID)) {
          const updatedLinkedClients = userLinkCls.filter(
            id => id !== removableClientID
          );
          user.linkedClients = joinArray(updatedLinkedClients);
        }
      }
      users.forEach(user => {
        newUsersState[user.id] = {
          id: user.id,
          name: user.name,
          linkedClients: user.linkedClients,
          availableProducts: user.availableProducts,
        };
      });

      ///////////////////////////////////////
      // ⬇ удаление зависимостей у продуктов
      const products = [];
      for (const product of Object.values(state.products)) {
        products.push(product);
      }
      const newProductsState = {};

      for (const product of Object.values(products)) {
        // ⬇ удаление availableToUsers в соответствии с удаленным клиентом.
        // При удалении клиента в product.availableToUsers остаются только те юзеры, которые не были привязаны к удаленному клиенту
        const prodAvToUsers = makeArray(product.availableToUsers);
        const prodAvToCls = makeArray(product.availableToClients);

        const intersectedUsers = prodAvToUsers.some(user =>
          removedClLinkedUsers.some(u => u === user)
        );

        if (
          intersectedUsers &&
          prodAvToCls.some(client => client === removableClientID)
        ) {
          const updatedProdAvToUsers = prodAvToUsers.filter(
            user => !removedClLinkedUsers.some(u => u === user)
          );
          product.availableToUsers = joinArray(updatedProdAvToUsers);
        }

        // ⬇ обновление списка доступности клиентам
        if (prodAvToCls.some(client => client === removableClientID)) {
          const updatedAvailableToClients = prodAvToCls.filter(
            id => id !== removableClientID
          );
          product.availableToClients = joinArray(updatedAvailableToClients);
        }
      }
      products.forEach(product => {
        newProductsState[product.id] = {
          id: product.id,
          name: product.name,
          availableToClients: product.availableToClients,
          availableToUsers: product.availableToUsers,
        };
      });

      /////////////////////////////////////
      // ⬇ Удаление самого клиента
      const clients = [];
      for (const client of Object.values(state.clients)) {
        clients.push(client);
      }

      const filteredClients = clients.filter(
        client => client.id !== removableClientID
      );

      const newClientsState = {};
      filteredClients.forEach(client => {
        newClientsState[client.id] = {
          id: client.id,
          name: client.name,
          linkedUsers: client.linkedUsers,
          availableProducts: client.availableProducts,
        };
      });

      // ⬇ итоговое обновление состояния
      state.clients = newClientsState;
      state.users = newUsersState;
      state.products = newProductsState;
    },

    //////////////////////////////////////////////////////////////////////
    // ⬇ Методы для пользователей
    addUser(state, action) {
      const newUser = action.payload;
      // ⬇ проверка на существующий айдишник юзера. Если существует то генерим и добавляем уже новый айдишник
      const extractedUsers = [];
      for (const user of Object.values(state.users)) {
        extractedUsers.push(user);
      }
      const existingUser = extractedUsers.find(user => user.id === newUser.id);
      const checkedUserID = existingUser
        ? `u${Math.round(Math.random() * 100000)}`
        : newUser.id;

      state.users[checkedUserID] = {
        id: checkedUserID,
        name: newUser.name,
        linkedClients: newUser.linkedClients,
        availableProducts: newUser.availableProducts,
      };
      // ⬇ привязка зависимости клиентам
      for (const client of Object.values(state.clients)) {
        const newUserLinkCls = makeArray(newUser.linkedClients);

        if (newUserLinkCls.some(cl => cl === client.id)) {
          client.linkedUsers = makeString(client.linkedUsers, newUser.id);
        }
      }
      // ⬇ привязка зависимости продуктам
      for (const product of Object.values(state.products)) {
        const newUserAvProds = makeArray(newUser.availableProducts);

        if (newUserAvProds.some(prod => prod === product.id)) {
          product.availableToUsers = makeString(
            product.availableToUsers,
            newUser.id
          );
        }
      }
    },

    ///////////////////////////////////
    // ⬇ редактирование пользователя
    editUser(state, action) {
      const editedUser = action.payload;
      //  ⬇ обработка клиентов, связанных с редактируемым юзером
      for (const client of Object.values(state.clients)) {
        const clLinkUsers = makeArray(client.linkedUsers);
        const edUsLinkCls = makeArray(editedUser.linkedClients);
        //  ⬇ отвязка клиента от пользователя (если клиент больше не привязан к пользователю)
        if (
          clLinkUsers.some(user => user === editedUser.id) &&
          !edUsLinkCls.some(cl => cl === client.id)
        ) {
          const updatedLinkedUsers = clLinkUsers.filter(
            user => user !== editedUser.id
          );
          client.linkedUsers = joinArray(updatedLinkedUsers);
        }
        // ⬇ привязка юзера, если ранее клиент-юзер не были связаны
        if (
          !clLinkUsers.some(user => user === editedUser.id) &&
          edUsLinkCls.some(cl => cl === client.id)
        ) {
          const updatedLinkedUsers = makeArray(client.linkedUsers);
          updatedLinkedUsers.push(editedUser.id);
          client.linkedUsers = joinArray(updatedLinkedUsers);
        }
      }

      // ⬇ обработка продуктов
      for (const product of Object.values(state.products)) {
        const prodAvToUsers = makeArray(product.availableToUsers);
        const edUsAvProds = makeArray(editedUser.availableProducts);
        // ⬇ отвязка досутпности юзеру, если ред. юзер был отключен
        if (
          prodAvToUsers.some(user => user === editedUser.id) &&
          !edUsAvProds.some(prod => prod === product.id)
        ) {
          const updatedAvToUsers = prodAvToUsers.filter(
            user => user !== editedUser.id
          );
          product.availableToUsers = joinArray(updatedAvToUsers);
        }
        if (
          !prodAvToUsers.some(user => user === editedUser.id) &&
          edUsAvProds.some(prod => prod === product.id)
        ) {
          const updatedAvToUsers = makeArray(product.availableToUsers);
          updatedAvToUsers.push(editedUser.id);
          product.availableToUsers = joinArray(updatedAvToUsers);
        }
      }
      // ⬇ обновление состояния редактируемого пользователя
      state.users[editedUser.id] = editedUser;
    },

    ///////////////////////////////////
    // ⬇ удаление пользователя
    removeUser(state, action) {
      const removableUserID = action.payload;

      // ⬇ удаление зависимостей у клиентов.
      const newClientsState = {};
      const clients = [];
      for (const client of Object.values(state.clients)) {
        clients.push(client);
      }
      for (const client of clients) {
        const linkedUsers = makeArray(client.linkedUsers);

        if (linkedUsers.some(user => user === removableUserID)) {
          const updatedLinkedUsers = linkedUsers.filter(
            user => user !== removableUserID
          );
          client.linkedUsers = joinArray(updatedLinkedUsers);
        }
      }
      clients.forEach(client => {
        newClientsState[client.id] = {
          id: client.id,
          name: client.name,
          linkedUsers: client.linkedUsers,
          availableProducts: client.availableProducts,
        };
      });

      // ⬇ удаление зависимостей у продуктов
      const newProductsState = {};
      const products = [];
      for (const product of Object.values(state.products)) {
        products.push(product);
      }
      for (const p of products) {
        const availableToUsers = makeArray(p.availableToUsers);

        if (availableToUsers.some(user => user === removableUserID)) {
          const updatedAvailableToUsers = availableToUsers.filter(
            u => u !== removableUserID
          );
          p.availableToUsers = joinArray(updatedAvailableToUsers);
        }
      }
      products.forEach(product => {
        newProductsState[product.id] = {
          id: product.id,
          name: product.name,
          availableToClients: product.availableToClients,
          availableToUsers: product.availableToUsers,
        };
      });

      // ⬇ удаление самого пользователя
      const newUsersState = {};
      const users = [];
      for (const user of Object.values(state.users)) {
        users.push(user);
      }
      const filteredUsers = users.filter(user => user.id !== removableUserID);
      filteredUsers.forEach(user => {
        newUsersState[user.id] = {
          id: user.id,
          name: user.name,
          linkedClients: user.linkedClients,
          availableProducts: user.availableProducts,
        };
      });
      // ⬇ итоговое обновление состояния для отправки в базу
      state.clients = newClientsState;
      state.users = newUsersState;
      state.products = newProductsState;
    },

    //////////////////////////////////////////////////////////////////////
    // ⬇ Методы для продуктов
    addProduct(state, action) {
      const newProduct = action.payload;
      // ⬇ проверка на существующий айдишник продукта. Если существует то генерим и добавляем уже новый айдишник
      const extractedProducts = [];
      for (const product of Object.values(state.products)) {
        extractedProducts.push(product);
      }
      const existingProduct = extractedProducts.find(
        product => product.id === newProduct.id
      );
      const checkedProductID = existingProduct
        ? `p${Math.round(Math.random() * 100000)}`
        : newProduct.id;

      state.products[checkedProductID] = {
        id: checkedProductID,
        name: newProduct.name,
        availableToClients: newProduct.availableToClients,
        availableToUsers: newProduct.availableToUsers,
      };
      // ⬇ привязка зависимости клиентам
      for (const client of Object.values(state.clients)) {
        const newProdAvToCl = makeArray(newProduct.availableToClients);

        if (newProdAvToCl.some(cl => cl === client.id)) {
          client.availableProducts = makeString(
            client.availableProducts,
            newProduct.id
          );
        }
      }
      // ⬇ привязка зависимости пользователям
      for (const user of Object.values(state.users)) {
        const newProdAvToUs = makeArray(newProduct.availableToUsers);

        if (newProdAvToUs.some(u => u === user.id)) {
          user.availableProducts = makeString(
            user.availableProducts,
            newProduct.id
          );
        }
      }
    },
    ////////////////////////////////////////
    // ⬇ редактирование продукта
    editProduct(state, action) {
      const editedProduct = action.payload;
      //  ⬇ обработка клиентов, связанных с редактируемым продуктом
      for (const client of Object.values(state.clients)) {
        const clAvProds = makeArray(client.availableProducts);
        const edProdAvToCls = makeArray(editedProduct.availableToClients);
        //  ⬇ отвязка продукта от клиента (если клиенту больше недоступен редактируемый продукт)
        if (
          clAvProds.some(prod => prod === editedProduct.id) &&
          !edProdAvToCls.some(cl => cl === client.id)
        ) {
          const updatedAvProds = clAvProds.filter(
            product => product !== editedProduct.id
          );
          client.availableProducts = joinArray(updatedAvProds);
        }
        // ⬇ привязка продукта, если ранее клиент-продукт не были связаны
        if (
          !clAvProds.some(prod => prod === editedProduct.id) &&
          edProdAvToCls.some(cl => cl === client.id)
        ) {
          const updatedAvProds = [...clAvProds];
          updatedAvProds.push(editedProduct.id);
          client.availableProducts = joinArray(updatedAvProds);
        }
      }

      // ⬇ обработка пользователей
      for (const user of Object.values(state.users)) {
        const userAvProds = makeArray(user.availableProducts);
        const edProdAvToUsers = makeArray(editedProduct.availableToUsers);
        // ⬇ отвязка досутпности юзеру, если он был отключен
        if (
          userAvProds.some(prod => prod === editedProduct.id) &&
          !edProdAvToUsers.some(u => u === user.id)
        ) {
          const updatedAvProds = userAvProds.filter(
            product => product !== editedProduct.id
          );
          user.availableProducts = joinArray(updatedAvProds);
        }
        // ⬇ привязка, если ранее данный продукт был недоступен
        if (
          !userAvProds.some(prod => prod === editedProduct.id) &&
          edProdAvToUsers.some(u => u === user.id)
        ) {
          const updatedAvProds = [...userAvProds];
          updatedAvProds.push(editedProduct.id);
          user.availableProducts = joinArray(updatedAvProds);
        }
      }
      // ⬇ обновление состояния редактируемого продукта
      state.products[editedProduct.id] = editedProduct;
    },

    ///////////////////////////////////
    // ⬇ удаление продукта
    removeProduct(state, action) {
      const removableProductID = action.payload;

      // ⬇ удаление зависимостей у клиентов.
      const newClientsState = {};
      const clients = [];
      for (const client of Object.values(state.clients)) {
        clients.push(client);
      }
      for (const client of clients) {
        const availableProducts = makeArray(client.availableProducts);

        if (availableProducts.some(product => product === removableProductID)) {
          const updatedAvProds = availableProducts.filter(
            product => product !== removableProductID
          );
          client.availableProducts = joinArray(updatedAvProds);
        }
      }
      clients.forEach(client => {
        newClientsState[client.id] = {
          id: client.id,
          name: client.name,
          linkedUsers: client.linkedUsers,
          availableProducts: client.availableProducts,
        };
      });

      // ⬇ удаление зависимостей у пользователей
      const newUsersState = {};
      const users = [];
      for (const user of Object.values(state.users)) {
        users.push(user);
      }
      for (const u of users) {
        const availableProducts = makeArray(u.availableProducts);

        if (availableProducts.some(product => product === removableProductID)) {
          const updatedAvProds = availableProducts.filter(
            p => p !== removableProductID
          );
          u.availableProducts = joinArray(updatedAvProds);
        }
      }
      users.forEach(user => {
        newUsersState[user.id] = {
          id: user.id,
          name: user.name,
          linkedClients: user.linkedClients,
          availableProducts: user.availableProducts,
        };
      });

      // ⬇ удаление самого продукта
      const newProductsState = {};
      const products = [];
      for (const product of Object.values(state.products)) {
        products.push(product);
      }
      const filteredProducts = products.filter(
        product => product.id !== removableProductID
      );
      filteredProducts.forEach(product => {
        newProductsState[product.id] = {
          id: product.id,
          name: product.name,
          availableToClients: product.availableToClients,
          availableToUsers: product.availableToUsers,
        };
      });
      // ⬇ итоговое обновление состояния для отправки в базу
      state.clients = newClientsState;
      state.users = newUsersState;
      state.products = newProductsState;
    },
  },
});

export const stateActions = stateSlice.actions;
export default stateSlice;
