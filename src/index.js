import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from './redux';

const firebaseConfig = {
  apiKey: 'AIzaSyD96WTH3vOmrvdM9ACsQnW8XtamQAICLpg',
  authDomain: 'dix-mille-lj.firebaseapp.com',
  databaseURL: 'https://dix-mille-lj.firebaseio.com',
  projectId: 'dix-mille-lj',
  storageBucket: 'dix-mille-lj.appspot.com',
  messagingSenderId: '460205070103',
  appId: '1:460205070103:web:35c8e07bf97913d7adc952',
  measurementId: 'G-R6TN7MHTGZ',
};

firebase.initializeApp(firebaseConfig);

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
