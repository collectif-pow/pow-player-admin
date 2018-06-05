import C from '../../constants';

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case C.SCAN:
			return action.ips;
		default:
			return state;
	}
};
