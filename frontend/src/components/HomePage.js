import React, {Component} from "react";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import RoomCreatePage from "./RoomCreatePage";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, ButtonGroup } from '@material-ui/core';

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode=this.clearRoomCode.bind(this);
    }

    async componentDidMount(){
        fetch("/api/user-in-room")
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                roomCode: data.code,
            });
        });
    }

    clearRoomCode(){
        this.setState({
            roomCode: null,
        });
    }

    renderHomePage(){
        return (
            <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                    <Typography component="h2" variant="h2" style={{color: 'white'}}>
                        <strong>Music Controller</strong>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" variant="contained" to="/join" component={Link}>Join a Room</Button>
                        <Button color="secondary" variant="contained" to="/create" component={Link}>Create a Room</Button>
                    </ButtonGroup>
                    
                </Grid>
            </Grid>
        );
    }

    render(){
        return (<Router>
            <Switch>
                <Route path='/join' component={RoomJoinPage}></Route>
                <Route path='/room/:roomCode' render={
                    (props)=> {
                        return <Room {...props} leaveRoomCallback={this.clearRoomCode} />
                    }}></Route>
                <Route path='/create' component={RoomCreatePage}></Route>
                <Route exact path='/' render={
                    ()=> {
                        return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`} />) : (this.renderHomePage())
                    }}></Route>
            </Switch>
        </Router>);
    }
}