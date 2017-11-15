import React from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import App from './App';
import './index.css';

// Initialise the FastClick plugin to remove the 300ms click delay on some mobile devices
initReactFastclick();

// Render the app to the 'root' <div>
ReactDOM.render(<App />, document.getElementById('root'));