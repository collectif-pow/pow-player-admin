import C from '../constants';

export const scanned = scanned => {
	return (dispatch, getState) => {
		dispatch({
			type: C.SCANNED,
			scanned,
		});
	};
};
