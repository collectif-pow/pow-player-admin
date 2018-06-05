import C from '../../constants';

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case C.GET_CRON:
			return action.cron;
		default:
			return state;
	}
};
