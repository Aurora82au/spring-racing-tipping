import React from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';
import './index.css';

// Initialise the FastClick plugin to remove the 300ms click delay on some mobile devices
initReactFastclick();

// Render the app to the 'root' <div>
ReactDOM.render(<App />, document.getElementById('root'));

// Register the service worker to cache assets and load them instantly on app start up
// registerServiceWorker();
unregister();