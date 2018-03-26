import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import { Layout } from './js/views/Layout.jsx';

require('./css/main/styles.scss');

// Add CSS files to bundle
// require('../css/styles.scss');
// Render application to DOM
ReactDOM.render(<Layout />, document.querySelector('#app'));
