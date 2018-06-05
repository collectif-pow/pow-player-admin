import C from '../constants';

export const getCron = cron => {
	return (dispatch, getState) => {
		dispatch({
			type: C.GET_CRON,
			cron,
		});
	};
};
