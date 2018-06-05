import C from '../../constants';

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case C.GET_PLAYERS:
			return action.players;
		case C.ADD_PLAYER:
			return state.concat([action.player]);
		case C.DELETE_PLAYER:
			return state.filter(e => e.id !== action.playerId);
		default:
			return state;
	}
};
