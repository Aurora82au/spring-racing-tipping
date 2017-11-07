import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import ScrollToTop from './components/ScrollToTop';
import Login from './components/Login';
import Admin from './components/Admin';
import Statistics from './components/Statistics';
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
            selectedMeet: 'CAULGUINEAS',
            selectedRace: 1,
            selectedTab: 1
        }
        // this.databaseURL = 'http://localhost:3001'; // Local
        this.databaseURL = 'https://sleepy-harbor-88560.herokuapp.com'; // Heroku
        
        this.path = '/'; // Local
        // this.path = '/spring-racing-tipping/'; // Github
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState === this.state);
    }

    async getData() {
        var self = this;
        try {
            // Used for local JSON files
            // let raceMeetResponse = await fetch(this.path + 'raceMeets.json'),
            //     meets = await raceMeetResponse.json(),
            //     punterResponse = await fetch(this.path + 'punters.json'),
            //     punters = await punterResponse.json(),
            //     tipsResponse = await fetch(this.path + 'tips.json'),
            //     tips = await tipsResponse.json();
            // self.setState({
            //     raceMeets: meets,
            //     punters: punters,
            //     tips: tips
            // });

            // Used for data coming from database
            axios.all([
                axios.get(this.databaseURL + '/racemeets'),
                axios.get(this.databaseURL + '/punters'),
                axios.get(this.databaseURL + '/tips')
            ]).then(axios.spread(function (meets, punters, tips) {
                    self.setState({
                        raceMeets: meets.data,
                        punters: punters.data,
                        tips: tips.data
                    });
                })
            ).catch(function (e) {
               console.log('An Axios error occurred: ' + e);
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
        if (localStorage.getItem('user')) {
            this.setState({
                authenticated: true,
                user: parseInt(localStorage.getItem('user'), 10),
                isAdmin: localStorage.getItem('isAdmin') === 'true',
                selectedMeet: localStorage.getItem('selectedMeet') || 'CAULGUINEAS'
            });
        }
    }

    handleLogin = (user, isAdmin) => {
        // Set the localStorage for the logged in user
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', isAdmin);
        this.setState({
            authenticated: true,
            user: user,
            isAdmin: isAdmin
        });
    }

    handleReloadData = () => {
        // Reload all the data
        this.getData();
    }

    handleMeetSelect = event => {
        localStorage.setItem('selectedMeet', event.target.value);
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

    handleTabSelect = tab => {
        this.setState({
            selectedTab: tab
        });
    }

    handleSaveTips = (modifiedRace, modifiedTips) => {
        axios.get(this.databaseURL + '/tips')
            .then(returnedTips => {
                let tips = this.state.tips,
                    tipsMeet = returnedTips.data.find(meet => { return meet.meetId === this.state.selectedMeet }),
                    punter = tipsMeet.races[modifiedRace - 1].punters.find(punter => { return punter.punterId === this.state.user }),
                    meetIndex = returnedTips.data.indexOf(tipsMeet),
                    punterIndex = returnedTips.data[meetIndex].races[modifiedRace - 1].punters.indexOf(punter);
    
                // Update the tips for the selected meet/race
                tipsMeet.races[modifiedRace - 1].punters[punterIndex].tips = modifiedTips.selections;
        
                // Insert the updated meet back into the tips array
                tips[meetIndex] = tipsMeet;
        
                // Send the updated tips to the database
                axios.put(this.databaseURL + '/tips/' + this.state.selectedMeet, tipsMeet);
        
                // Update the local state with the updated tips array
                this.setState({
                    tips: tips
                });
            });
    }

    handleSavePlacings = (modifiedRace, modifiedPlacings) => {
        let raceMeets = this.state.raceMeets,
            meet = raceMeets.find(meet => { return meet.meetId === this.state.selectedMeet }),
            meetIndex = raceMeets.indexOf(meet);

        // Update the placings for the selected meet/race
        meet.races[modifiedRace - 1].placings = modifiedPlacings;

        // Insert the updated meet back into the raceMeets array
        raceMeets[meetIndex] = meet;

        // Send the updated meet to the database
        axios.put(this.databaseURL + '/racemeets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated raceMeets array
        this.setState({
            raceMeets: raceMeets
        });
    }

    handleSaveStatus = event => {
        let raceMeets = this.state.raceMeets,
            meet = raceMeets.find(meet => { return meet.meetId === this.state.selectedMeet }),
            meetIndex = raceMeets.indexOf(meet);

        // Update the placings for the selected meet/race
        meet.races[event.target.getAttribute('data-race') - 1].status = event.target.getAttribute('data-status');
        
        // Insert the updated meet back into the raceMeets array
        raceMeets[meetIndex] = meet;

        // Send the updated meet to the database
        axios.put(this.databaseURL + '/racemeets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated raceMeets array
        this.setState({
            raceMeets: raceMeets
        });
    }

    handleSaveScratchings = (modifiedRace, modifiedScratchings) => {
        let raceMeets = this.state.raceMeets,
            meet = raceMeets.find(meet => { return meet.meetId === this.state.selectedMeet }),
            meetIndex = raceMeets.indexOf(meet);

        // Update the placings for the selected meet/race
        meet.races[modifiedRace - 1].scratchings = modifiedScratchings;
        
        // Insert the updated meet back into the raceMeets array
        raceMeets[meetIndex] = meet;

        // Send the updated meet to the database
        axios.put(this.databaseURL + '/racemeets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated raceMeets array
        this.setState({
            raceMeets: raceMeets
        });
    }

    render() {
        if (this.state.raceMeets.length) {
            return (
                <Router>
                    <ScrollToTop>
                        <Switch>
                            <Route exact path={this.path + 'login'} render={routeProps => <Login {...routeProps} path={this.path} punters={this.state.punters} handleLogin={this.handleLogin} authenticated={this.state.authenticated} user={this.state.user} isAdmin={this.state.isAdmin} />} />
                            <Route exact path={this.path + 'admin'} render={routeProps => (this.state.authenticated && this.state.isAdmin) ? <Admin {...routeProps} path={this.path} raceMeets={this.state.raceMeets} punters={this.state.punters} selectedMeet={this.state.selectedMeet} onReloadData={this.handleReloadData} onMeetChange={this.handleMeetSelect} onPlacingsChange={this.handleSavePlacings} onStatusChange={this.handleSaveStatus} onScratchingChange={this.handleSaveScratchings} user={this.state.user} isAdmin={this.state.isAdmin} /> : <Redirect to={this.path + 'login'} />} />
                            <Route exact path={this.path + 'information'} render={routeProps => this.state.authenticated ? <Information {...routeProps} path={this.path} punters={this.state.punters} onReloadData={this.handleReloadData} authenticated={this.state.authenticated} user={this.state.user} isAdmin={this.state.isAdmin} /> : <Redirect to={this.path + 'login'} />} />
                            <Route exact path={this.path + 'statistics'} render={routeProps => this.state.authenticated ? <Statistics {...routeProps} path={this.path} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} selectedTab={this.state.selectedTab} onTabSelect={this.handleTabSelect} onReloadData={this.handleReloadData} authenticated={this.state.authenticated} user={this.state.user} isAdmin={this.state.isAdmin} /> : <Redirect to={this.path + 'login'} />} />
                            <Route exact path={this.path + 'tips'} render={routeProps => this.state.authenticated ? <Tips {...routeProps} path={this.path} raceMeets={this.state.raceMeets} tips={this.state.tips} punters={this.state.punters} selectedMeet={this.state.selectedMeet} onReloadData={this.handleReloadData} onMeetChange={this.handleMeetSelect} onSelectionChange={this.handleSaveTips} user={this.state.user} isAdmin={this.state.isAdmin} /> : <Redirect to={this.path + 'login'} />} />
                            <Route exact path={this.path + 'results'} render={routeProps => this.state.authenticated ? <Results {...routeProps} path={this.path} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} selectedMeet={this.state.selectedMeet} selectedRace={this.state.selectedRace} onReloadData={this.handleReloadData} onMeetChange={this.handleMeetSelect} onRaceChange={this.handleRaceSelect} user={this.state.user} isAdmin={this.state.isAdmin} /> : <Redirect to={this.path + 'login'} />} />
                            <Route exact path={this.path + 'leaderboard'} render={routeProps => this.state.authenticated ? <Leaderboard {...routeProps} path={this.path} raceMeets={this.state.raceMeets} punters={this.state.punters} tips={this.state.tips} user={this.state.user} onReloadData={this.handleReloadData} isAdmin={this.state.isAdmin} /> : <Redirect to={this.path + 'login'} />} />
                            <Redirect from='/' to={this.path + 'results'} />
                        </Switch>
                    </ScrollToTop>
                </Router>
            );
        }
        else {
            return <div></div>;
        }
    }
}

export default App;


// Racing days

// Caulfield Guineas day 14/10/17
// Caulfield cup 21/10/17
// Cox plate 28/10/17
// Derby day 4/11/17
// Cup day 7/11/17
// Oaks day 9/11/17
// Stakes day 11/11/17



// Use to time functions

//var t0 = performance.now();
//var t1 = performance.now();
//console.log("While loops took " + (t1 - t0) + " milliseconds.");