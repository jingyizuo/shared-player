import React, {Component} from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Link } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab"


export default class RoomCreatePage extends Component{
    default_votes = 2;
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updataCallback: ()=>{},
    };
    constructor(props){
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };
        this.handleVotesChange = this.handleVotesChange.bind(this)
        this.handleControlChange = this.handleControlChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    handleVotesChange(e){
        this.setState({votesToSkip: e.target.value,});
    }
    handleControlChange(e){
        this.setState({guestCanPause: e.target.value === 'true' ? true : false ,});
    }
    handleSubmit(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        fetch("/api/create-room",requestOptions).then((response)=>response.json()).then((data)=>this.props.history.push("/room/"+data.code));
    }

    handleUpdate(){
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }),
        };
        fetch("/api/update-room",requestOptions).then((response)=>{
            if(response.ok){
                this.setState({
                    successMsg : "Room updated successfully.",
                });
            }
            else{
                this.setState({
                    errorMsg : "Error updating room.",
                });
            }
            this.props.updataCallback();
        });
        
    }

    renderCreateButtons(){
        return (
            <Grid container spacing={1}>
               <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.handleSubmit} >Create A Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid> 
            </Grid>
        );
    }

    renderUpdateButtons(){
        return (
            <Grid container spacing={1}>
               <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleUpdate} >Update Room</Button>
                </Grid>
            </Grid>
        );
    }

    render(){
        const title = this.props.update ? "Update a Room" : "Create a Room";

        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={this.state.errorMsg!="" || this.state.successMsg!=""}>
                    {this.state.successMsg!="" ? 
                    (<Alert onClose={()=>{this.setState({successMsg:""})}}>{this.state.successMsg}</Alert>) : 
                    (<Alert onClose={()=>{this.setState({errorMsg:""})}}>{this.state.errorMsg}</Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h3" variant="h3" style={{color: 'white'}}>
                    <strong>{title}</strong>
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center" >Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleControlChange}>
                        <FormControlLabel value="true" control={<Radio color="default"/>} label="Play/Pause" labelPlacement="bottom"></FormControlLabel>
                        <FormControlLabel value="false" control={<Radio color="default"/>} label="No Control" labelPlacement="bottom"></FormControlLabel>
                    </RadioGroup>
                </FormControl> 
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} type="number" defaultValue={this.state.votesToSkip} onChange={this.handleVotesChange} inputProps={{min:1, style:{textAlign: "center"}}} />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
        </Grid>);
    }
}