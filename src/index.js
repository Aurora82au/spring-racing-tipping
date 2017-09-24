import React from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

initReactFastclick();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
