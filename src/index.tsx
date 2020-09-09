import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import { defaultFontSizeParagraph, defaultFontFamilyEn } from './styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './pages/App';
import store from './state';
import * as serviceWorker from './serviceWorker';

import ImgBg from './assets/images/bg.png';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
library.add(faCog, faCheckSquare, faCoffee);

const BithumbGlobalStyle = createGlobalStyle`
  body {
    ${defaultFontSizeParagraph}
    ${defaultFontFamilyEn}
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    margin: 0;
    min-height: 100vh;

    background-image: url(${ImgBg});
    background-size:70% 100%;
    background-repeat: no-repeat;
  }
`;

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BithumbGlobalStyle />
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
