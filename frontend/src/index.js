import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import { Provider } from 'react-redux';
import store from './store'
import App from './App';

import { transitions, positions,types,Provider as AlertProvider } from 'react-alert'
// import AlertTemplate from 'react-alert-template-basic'
// optional configuration
const options = {
  position: positions.TOP_CENTER,
  type: types.SUCCESS,
  timeout: 3000,
  offset: '30px',
  transition: transitions.SCALE,
}
const AlertTemplate = ({ style, options, message, close }) => (
  <div>
    {message}
  </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>
);

