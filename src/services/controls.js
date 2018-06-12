import C from '../constants';
import { store } from '../store';
import * as S from '../actions/scan';
import * as SD from '../actions/scanned';
import * as CR from '../actions/cron';

const url = process.env.SERVER_URL;

export const play = async () => {
	const res = await fetch(`${url}:3000/api/play`);
	const json = await res.json();
	return json;
};

export const stop = async () => {
	const res = await fetch(`${url}:3000/api/stop`);
	const json = await res.json();
	return json;
};

export const turnOn = async () => {
	const res = await fetch(`${url}:3000/api/on`);
	const json = await res.json();
	return json;
};

export const turnOff = async () => {
	const res = await fetch(`${url}:3000/api/off`);
	const json = await res.json();
	return json;
};

export const cron = async (start, end) => {
	const fd = new FormData();
	fd.append('startH', new Date(start).getHours());
	fd.append('startM', new Date(start).getMinutes());
	fd.append('endH', new Date(end).getHours());
	fd.append('endM', new Date(end).getMinutes());
	const res = await fetch(`${url}:3000/api/cron`, {
		method: 'POST',
		body: fd,
	});
	const result = await res.json();
	store.dispatch(
		CR.getCron({
			startH: new Date(start).getHours(),
			startM: new Date(start).getMinutes(),
			endH: new Date(end).getHours(),
			endM: new Date(end).getMinutes(),
		})
	);
	return result;
};

export const getCron = async () => {
	const res = await fetch(`${url}:3000/api/cron`);
	const cron = await res.json();
	store.dispatch(CR.getCron(cron));
	return cron;
};

export const scan = async () => {
	const res = await fetch(`${url}:3000/api/scan`);
	const json = await res.json();
	const missingIps = json.error ? json.error : [];
	store.dispatch(S.scan(missingIps));
	store.dispatch(SD.scanned(true));
	return json;
};
