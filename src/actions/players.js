import C from '../constants';

export const getPlayers = players => {
	return (dispatch, getState) => {
		dispatch({
			type: C.GET_PLAYERS,
			players,
		});
	};
};

export const addPlayer = player => {
	return (dispatch, getState) => {
		dispatch({
			type: C.ADD_PLAYER,
			player,
		});
	};
};

export const deletePlayer = playerId => {
	return (dispatch, getState) => {
		dispatch({
			type: C.DELETE_PLAYER,
			playerId,
		});
	};
};
