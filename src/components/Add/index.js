import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import isIp from '../../utils/isIp';
import { addPlayer } from '../../services/players.js';

import { scanned } from '../../actions/scanned';

import './style.css';

class Add extends Component {
	state = {
		visible: false,
		name: '',
		ip: '',
		disabled: true,
		rs232: false,
	};

	handleAdd = () => {
		this.setState({ visible: true });
	};

	handleClose = async canceled => {
		this.setState({ visible: false });
		if (!canceled) {
			await addPlayer(this.state.name, this.state.ip, this.state.rs232);
			this.props.dispatch(scanned(false));
		}
		this.setState({ name: '', ip: '', disabled: true });
	};

	handleChange = input => event => {
		const isValidIp = ip => {
			return (
				isIp(this.state.ip) &&
				!this.props.players.map(p => p.ip).includes(this.state.ip) &&
				!this.state.ip.endsWith('.255') &&
				!this.state.ip.endsWith('.0') &&
				!this.state.ip.endsWith('.00') &&
				!this.state.ip.endsWith('.000')
			);
		};
		this.setState(
			{
				[input]: event.target.value,
			},
			() => {
				if (this.state.name.length && isValidIp(this.state.ip))
					this.setState({ disabled: false });
				else this.setState({ disabled: true });
			}
		);
	};

	handleCheckBoxChange = () => () => {
		this.setState({ rs232: !this.state.rs232 });
	};

	render() {
		return (
			<Fragment>
				<Button
					variant="fab"
					color="secondary"
					aria-label="add"
					className="add"
					onClick={this.handleAdd}
				>
					<AddIcon />
				</Button>
				<Dialog
					open={this.state.visible}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Add a player</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please fill the following to declare a new player.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Name"
							value={this.state.name}
							onChange={this.handleChange('name')}
							fullWidth
						/>
						<TextField
							margin="dense"
							id="ip"
							label="IP"
							value={this.state.ip}
							onChange={this.handleChange('ip')}
							fullWidth
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.rs232}
									onChange={this.handleCheckBoxChange()}
								/>
							}
							label="RS232"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose.bind(this, true)}>Cancel</Button>
						<Button
							onClick={this.handleClose.bind(this, false)}
							disabled={this.state.disabled}
							color="primary"
						>
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}

export default connect(state => state)(Add);
