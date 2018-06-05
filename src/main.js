import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import Players from './components/Players';

import './index.css';

const App = () => (
	<Provider store={store}>
		<Players />
	</Provider>
);

ReactDOM.render(App(), document.getElementById('root'));
