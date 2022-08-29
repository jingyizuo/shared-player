import React, {Component} from "react";
import { Button, Grid, Typography, TextField } from '@material-ui/core';
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleJoin = this.handleJoin.bind(this)
    }
    handleTextChange(e){
        this.setState({
            roomCode: e.target.value,
        });
    }

    handleJoin(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: this.state.roomCode,
            }),
        };
        fetch("/api/join-room", requestOptions)
        .then((response) => {
            if (response.ok) {
            this.props.history.push(`/room/${this.state.roomCode}`);
            } else {
            this.setState({ error: "Room not found." });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <Typography component="h3" variant="h3" style={{color: 'white'}}>
                        <strong>Join a Room</strong>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField error={this.state.error} lable="Code" placeholder="Enter a Room Code" value={this.state.roomCode} helperText={this.state.error} variant="outlined" onChange={this.handleTextChange} inputProps={{style:{color: 'white' }}}/>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" variant="contained" onClick={this.handleJoin} >Enter Room</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button color="primary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        );
    }
}