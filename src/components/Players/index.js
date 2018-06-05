import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import DeviceHub from '@material-ui/icons/DeviceHub';
import Help from '@material-ui/icons/Help';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Add from '../Add';
import Controls from '../Controls';

import { getPlayers, deletePlayer } from '../../services/players.js';

import './style.css';

class Players extends Component {
	state = {
		players: [],
	};

	async componentDidMount() {
		await getPlayers();
	}

	async handleRemove(player) {
		await deletePlayer(player.id);
	}

	render() {
		const items = this.props.players.map(player => {
			const status = ip => {
				if (!this.props.scanned) return <Help />;
				else if (this.props.scan.includes(ip)) {
					return <Error color="error" />;
				} else return <CheckCircle style={{ color: 'hsl(145, 28%, 45%)' }} />;
			};
			return (
				<ListItem className="players__item" key={player.id}>
					{player.rs232 === 'true' && (
						<ListItemIcon>
							<DeviceHub color="primary" />
						</ListItemIcon>
					)}
					<ListItemText className="players__name" primary={player.name} />
					<ListItemIcon>{status(player.ip)}</ListItemIcon>
					<ListItemText className="players__ip" primary={player.ip} />
					<ListItemSecondaryAction>
						<IconButton
							aria-label="Delete"
							onClick={this.handleRemove.bind(this, player)}
						>
							<Delete />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			);
		});

		return (
			<Fragment>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="title" color="inherit">
							POW Player
						</Typography>
					</Toolbar>
				</AppBar>
				<div className="container">
					<Paper className="players" elevation={4}>
						<List className="players__list">{items}</List>
					</Paper>
					<Add />
					<Controls />
				</div>
			</Fragment>
		);
	}
}

export default connect(state => state)(Players);
