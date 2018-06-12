import C from '../constants';
import { store } from '../store';
import * as A from '../actions/players';

const url = process.env.SERVER_URL;

export const getPlayers = async () => {
	const res = await fetch(`${url}:3000/api/player`);
	const players = await res.json();
	store.dispatch(A.getPlayers(players));
	return players;
};

export const deletePlayer = async id => {
	const res = await fetch(`${url}:3000/api/player/${id}`, { method: 'DELETE' });
	const result = await res.json();
	store.dispatch(A.deletePlayer(id));
	return result;
};

export const addPlayer = async (name, ip, rs232) => {
	const fd = new FormData();
	fd.append('name', name);
	fd.append('ip', ip);
	fd.append('rs232', rs232);
	const res = await fetch(`${url}:3000/api/player`, {
		method: 'POST',
		body: fd,
	});
	const result = await res.json();
	store.dispatch(A.addPlayer(result));
	return result;
};
