import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Renderer3D from './3DRenderer';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import store from './store';
import App from './example10'
 
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Renderer3D/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
