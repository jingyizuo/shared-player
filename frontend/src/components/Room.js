import React, {Component} from "react";
import MusicPlayer from "./MusicPlayer";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, ButtonGroup } from '@material-ui/core';


export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: 2,
            isHost: false,
            show_settings: false,
            spotifyAuthenticated: false,
            song: {},
        };
        
        this.roomCode = this.props.match.params.roomCode;
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.renderSettingButton = this.renderSettingButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this)
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000);
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }

    updateSettings(value){
        this.setState({
            show_settings: value,
        });
    }

    getRoomDetails(){
        return fetch("/api/get-room?code="+this.roomCode)
            .then((response)=>{
                if (!response.ok){
                    this.props.leaveRoomCallback();
                    this.props.history.push("/");
                }
                else{
                    return response.json();
                }})
            .then((data)=>{
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
                if(this.state.isHost){
                    this.authenticateSpotify();
                }
            });
    }

    getCurrentSong(){
        fetch('/spotify/current-song').then((response)=> {
            if (!response.ok){
                return {};
            }
            else{
                return response.json();
            }
        }).then((data)=>{
            this.setState({song: data});
        });
    }

    authenticateSpotify(){
        fetch("/spotify/is-auth").then((response) => response.json()).then((data) => {
            this.setState({ spotifyAuthenticated: data.status });
            console.log(data.status);
            if (!data.status) {
            fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
            }
        });
    }

    handleLeaveRoom(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/api/leave-room", requestOptions)
            .then((response)=> {
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            });
    }
    //why having a separate function, only show the setting button when user is the host
    renderSettingButton(){
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={() => this.updateSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    renderSettings(){
        return (<Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <RoomCreatePage 
                update={true} 
                votesToSkip={this.state.votesToSkip} 
                guestCanPause={this.state.guestCanPause} 
                roomCode={this.roomCode}
                updateCallback={this.getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" onClick={() => {this.updateSettings(false); this.getRoomDetails();}}>Close</Button>
            </Grid>
        </Grid>);
    }

    render(){
        if (this.state.show_settings){
            return this.renderSettings();
        }
        return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography component="h3" variant="h3" style={{color: 'white'}}>
                    <strong>CODE: {this.roomCode}</strong>
                </Typography>
            </Grid>
            <MusicPlayer {...this.state.song}/>
            {this.state.isHost ? this.renderSettingButton() : null}
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={this.handleLeaveRoom}>Leave Room</Button>
            </Grid>
        </Grid>
        
        );
    }
}

/*
<div>
            <p>Code: {this.roomCode}</p>
            <p>Votes: {this.state.votesToSkip}</p>
            <p>Control: {this.state.guestCanPause.toString()}</p>
            <p>Host: {this.state.isHost.toString()}</p>
        </div>*/