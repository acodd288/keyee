import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import keyboardApp from './reducers'
import {fetchFile} from './actions/buffer'
import writeFileMiddleware from './middleware/writefile'

const middlewares = [];

middlewares.push(thunkMiddleware);
middlewares.push(writeFileMiddleware);

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = compose(applyMiddleware(...middlewares))(createStore)(keyboardApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
