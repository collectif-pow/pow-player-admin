import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// hot module reloading for the store
const hmr = store => {
	if (module.hot) {
		module.hot.accept(() => {
			// eslint-disable-next-line global-require
			const nextRootReducer = require('./reducers').default;
			store.replaceReducer(nextRootReducer);
		});
	}
};

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export const configureStore = () => {
	const store = createStoreWithMiddleware(
		rootReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	);
	hmr(store);
	return store;
};

export const store = configureStore();
