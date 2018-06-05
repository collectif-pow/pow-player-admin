import C from '../../constants';

const initialState = false;

export default (state = initialState, action) => {
	switch (action.type) {
		case C.SCANNED:
			return action.scanned;
		default:
			return state;
	}
};
