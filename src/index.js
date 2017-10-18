import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import keyboardApp from './reducers'
import writeFileMiddleware from './middleware/writefile'
import swipeTrackerMiddleware from './middleware/swipeTracker'
import {setWordPriors} from './actions/swipe'
import words from './data/words.en.json'

const middlewares = [];

middlewares.push(thunkMiddleware);
middlewares.push(writeFileMiddleware);
middlewares.push(swipeTrackerMiddleware);

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = compose(applyMiddleware(...middlewares))(createStore)(keyboardApp);

console.log(words.length);

let words2 = words.map((e) => {
  e = {...e};
  e.probability = e.f;
  e.word = e[' word'];
  delete e[' word'];
  delete e.f;
  return e;
})

words2 = words2.filter((e) => {
  return e.word && e.probability;
});

words2.sort((a,b) => b.probability - a.probability);
words2 = words2.slice(0,1000);

console.log(words2.length)

store.dispatch(setWordPriors(words2));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
