import { combineReducers } from 'redux';
import players from './players';
import scan from './scan';
import scanned from './scanned';
import cron from './cron';

const rootReducer = combineReducers({
	players,
	scan,
	scanned,
	cron,
});

export default rootReducer;
