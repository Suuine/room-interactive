import React from 'react';
import ReactDOM from 'react-dom/client';
import Cassete from './Cassete';
// @ts-ignore: CSS import without type declarations
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Cassete />
  </React.StrictMode>
);