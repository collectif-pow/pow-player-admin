import C from '../constants';

export const scan = ips => {
	return (dispatch, getState) => {
		dispatch({
			type: C.SCAN,
			ips,
		});
	};
};
