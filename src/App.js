import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
            tips: []
        }
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

    render() {
        if (this.state.raceMeets.length) {
            return (
                <Router>
                    <Switch>
                        <Route exact path="/admin" component={Admin} />
                        <Route exact path="/information" component={Information} />
                        <Route exact path="/tips" render={routeProps => <Tips {...routeProps} raceMeets={this.state.raceMeets} tips={this.state.tips} />} />
                        <Route exact path="/results" render={routeProps => <Results {...routeProps} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} />} />
                        <Route exact path="/leaderboard" render={routeProps => <Leaderboard {...routeProps} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} />} />
                        <Redirect from='/' to='/results' />
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