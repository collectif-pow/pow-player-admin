import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import Cached from '@material-ui/icons/Cached';
import CloseIcon from '@material-ui/icons/Close';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import TimePicker from 'material-ui-pickers/TimePicker';
import moment from 'moment';

import { play, stop, turnOn, turnOff, cron, getCron, scan } from '../../services/controls';

import './style.css';

class Controls extends Component {
	state = {
		snackOpen: false,
		snackMessage: '',
		scanDisabled: false,
	};

	async componentDidMount() {
		await getCron();
	}

	playVideo = async () => {
		const result = await play();
		if (!result.success) {
			this.setState({
				snackOpen: true,
				snackMessage: `An error occured! ${JSON.stringify(result.error)}`,
			});
		}
	};

	stopVideo = async () => {
		const result = await stop();
		if (!result.success) {
			this.setState({
				snackOpen: true,
				snackMessage: `An error occured! ${JSON.stringify(result.error)}`,
			});
		}
	};

	scanPlayers = async () => {
		this.setState({ scanDisabled: true }, async () => {
			const result = await scan();
			if (result.error && result.error.filter(e => e !== null).length) {
				this.setState({
					snackOpen: true,
					snackMessage: `The following IPs are not reachable: ${result.error
						.filter(e => e !== null)
						.join(', ')}`,
				});
			}
			this.setState({ scanDisabled: false });
		});
	};

	updateCron = async (start, end) => {
		const result = await cron(start, end);
		if (result.error) {
			this.setState({
				snackOpen: true,
				snackMessage: `An error occured! ${JSON.stringify(result.error)}`,
			});
		}
	};

	handleSnackClose = () => {
		this.setState({ snackOpen: false, snackMessage: '' });
	};

	handleStartTimeChange = async date => {
		let end = new Date();
		if (this.props.cron.endH) {
			end.setHours(this.props.cron.endH);
			end.setMinutes(this.props.cron.endM);
			end.setSeconds(0);
		}
		await this.updateCron(date, end);
	};

	handleEndTimeChange = async date => {
		let start = new Date();
		if (this.props.cron.startH) {
			start.setHours(this.props.cron.startH);
			start.setMinutes(this.props.cron.startM);
			start.setSeconds(0);
		}
		await this.updateCron(start, date);
	};

	vpOn = async () => {
		const result = await turnOn();
		if (!result.success) {
			this.setState({
				snackOpen: true,
				snackMessage: `An error occured! ${JSON.stringify(result.error)}`,
			});
		}
	};

	vpOff = async () => {
		const result = await turnOff();
		if (!result.success) {
			this.setState({
				snackOpen: true,
				snackMessage: `An error occured! ${JSON.stringify(result.error)}`,
			});
		}
	};

	render() {
		let start = new Date();
		if (this.props.cron.startH) {
			start.setHours(this.props.cron.startH);
			start.setMinutes(this.props.cron.startM);
			start.setSeconds(0);
		}
		let end = new Date();
		if (this.props.cron.endH) {
			end.setHours(this.props.cron.endH);
			end.setMinutes(this.props.cron.endM);
			end.setSeconds(0);
		}
		return (
			<Fragment>
				<Paper className="controls" elevation={4}>
					<Button variant="raised" className="controls__play" onClick={this.playVideo}>
						<PlayArrow />
						Play
					</Button>
					<Button variant="raised" color="secondary" onClick={this.stopVideo}>
						<Stop />
						Stop
					</Button>
					<Button
						variant="raised"
						color="primary"
						onClick={this.scanPlayers}
						disabled={this.state.scanDisabled}
						className={this.state.scanDisabled ? 'rotating' : ''}
					>
						<Cached />
						Scan
					</Button>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<TimePicker
							ampm={false}
							label="Start time"
							value={start}
							onChange={this.handleStartTimeChange}
						/>
						<TimePicker
							ampm={false}
							label="End time"
							value={end}
							onChange={this.handleEndTimeChange}
						/>
					</MuiPickersUtilsProvider>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						open={this.state.snackOpen}
						autoHideDuration={6000}
						onClose={this.handleSnackClose}
						message={<span>{this.state.snackMessage}</span>}
						action={[
							<IconButton
								key="close"
								aria-label="Close"
								color="inherit"
								onClick={this.handleSnackClose}
							>
								<CloseIcon />
							</IconButton>,
						]}
					/>
				</Paper>
				<Paper className="controls" elevation={4}>
					<Button variant="raised" className="controls__play" onClick={this.vpOn}>
						<PlayArrow />
						RS232 On
					</Button>
					<Button variant="raised" color="secondary" onClick={this.vpOff}>
						<Stop />
						RS232 Off
					</Button>
				</Paper>
			</Fragment>
		);
	}
}

export default connect(state => state)(Controls);
