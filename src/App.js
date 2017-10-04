import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
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
            user: 1,
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
        this.getData();
    }

    handleLogin = (user, isAdmin) => {
        console.log('in handleLogin');
        this.setState({
            user: user,
            isAdmin: isAdmin
        });
        window.location.href = '/';
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
                        <Route exact path="/login" render={routeProps => <Login {...routeProps} punters={this.state.punters} handleLogin={this.handleLogin} isAdmin={this.state.isAdmin} />} />
                        <Route exact path="/admin" render={routeProps => <Admin {...routeProps} raceMeets={this.state.raceMeets} selectedMeet={this.state.selectedMeet} onMeetChange={this.handleMeetSelect} isAdmin={this.state.isAdmin} />} />
                        <Route exact path="/information" render={routeProps => <Information {...routeProps} isAdmin={this.state.isAdmin} />} />
                        <Route exact path="/tips" render={routeProps => <Tips {...routeProps} raceMeets={this.state.raceMeets} tips={this.state.tips} selectedMeet={this.state.selectedMeet} onMeetChange={this.handleMeetSelect} isAdmin={this.state.isAdmin} />} />
                        <Route exact path="/results" render={routeProps => <Results {...routeProps} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} selectedMeet={this.state.selectedMeet} selectedRace={this.state.selectedRace} onMeetChange={this.handleMeetSelect} onRaceChange={this.handleRaceSelect} isAdmin={this.state.isAdmin} />} />
                        <Route exact path="/leaderboard" render={routeProps => <Leaderboard {...routeProps} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} isAdmin={this.state.isAdmin} />} />
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