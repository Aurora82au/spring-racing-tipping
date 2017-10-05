import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Information from './components/Information';
import Tips from './components/Tips';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            raceMeets: [],
            punters: [],
            tips: [],
            authenticated: false,
            user: 0,
            isAdmin: false,
            selectedMeet: 'CAULCUP',
            selectedRace: 1
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState === this.state);
    }

    async getData() {
        try {
            let raceMeetResponse = await fetch('raceMeets.json'),
                meets = await raceMeetResponse.json(),
                punterResponse = await fetch('punters.json'),
                punters = await punterResponse.json(),
                tipsResponse = await fetch('tips.json'),
                tips = await tipsResponse.json();
            this.setState({
                raceMeets: meets,
                punters: punters,
                tips: tips
            });
        }
        catch (e) {
            console.log('An error occurred: ' + e);
        }
    }

    componentDidMount() {
        // Load all the data
        this.getData();
        // Check if the user is already logged in
        if (sessionStorage.getItem('user')) {
            this.setState({
                authenticated: true,
                user: sessionStorage.getItem('user'),
                isAdmin: sessionStorage.getItem('isAdmin')
            });
        }
    }

    handleLogin = (user, isAdmin) => {
        // Set the sessionStorage for the logged in user
        sessionStorage.setItem('user', user);
        sessionStorage.setItem('isAdmin', isAdmin);
        this.setState({
            authenticated: true,
            user: user,
            isAdmin: isAdmin
        });
    }

    handleMeetSelect = event => {
        this.setState({
            selectedMeet: event.target.value,
            selectedRace: 1
        });
    }

    handleRaceSelect = event => {
        this.setState({
            selectedRace: parseInt(event.target.id, 10)
        });
    }

    render() {
        if (this.state.raceMeets.length) {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/login" render={routeProps => <Login {...routeProps} punters={this.state.punters} handleLogin={this.handleLogin} authenticated={this.state.authenticated} isAdmin={this.state.isAdmin} />} />
                        <Route exact path="/admin" render={routeProps => this.state.authenticated ? <Admin {...routeProps} raceMeets={this.state.raceMeets} selectedMeet={this.state.selectedMeet} onMeetChange={this.handleMeetSelect} isAdmin={this.state.isAdmin} /> : <Redirect to='/login' />} />
                        <Route exact path="/information" render={routeProps => this.state.authenticated ? <Information {...routeProps} authenticated={this.state.authenticated} isAdmin={this.state.isAdmin} /> : <Redirect to='/login' />} />
                        <Route exact path="/tips" render={routeProps => this.state.authenticated ? <Tips {...routeProps} raceMeets={this.state.raceMeets} tips={this.state.tips} selectedMeet={this.state.selectedMeet} onMeetChange={this.handleMeetSelect} isAdmin={this.state.isAdmin} /> : <Redirect to='/login' />} />
                        <Route exact path="/results" render={routeProps => this.state.authenticated ? <Results {...routeProps} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} selectedMeet={this.state.selectedMeet} selectedRace={this.state.selectedRace} onMeetChange={this.handleMeetSelect} onRaceChange={this.handleRaceSelect} isAdmin={this.state.isAdmin} /> : <Redirect to='/login' />} />
                        <Route exact path="/leaderboard" render={routeProps => this.state.authenticated ? <Leaderboard {...routeProps} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} isAdmin={this.state.isAdmin} /> : <Redirect to='/login' />} />
                        <Redirect from='/' to='/information' />
                        {/* <Redirect from='/spring-racing-tipping' to='/spring-racing-tipping/information' /> */}
                    </Switch>
                </Router>
            );
        }
        else {
            return <div></div>;
        }
    }
}

export default App;



// Caulfield Guineas day 14/10/17
// Caulfield cup 21/10/17
// Cox plate 28/10/17
// Darby day 3/11/17
// Cup day 7/11/17
// Oaks day 9/11/17
// Stakes day 11/11/17



//var t0 = performance.now();
//var t1 = performance.now();
//console.log("While loops took " + (t1 - t0) + " milliseconds.");