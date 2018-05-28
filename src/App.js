import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import ErrorHandling from './components/ErrorHandling';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Statistics from './pages/Statistics';
import Information from './pages/Information';
import Tips from './pages/Tips';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import './App.css';

// TODO: Set selected competition

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitions: [],
            meets: [],
            races: [],
            punters: [],
            tips: [],
            authenticated: false,
            user: 0,
            isAdmin: false,
            selectedCompetition: {
                _id: 12345678,
                name: "Colin's Tipping Comp 2017",
                startDate: '2017-10-14',
                admins: [1, 7],
                punters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            },
            selectedMeet: null,
            selectedRace: null,
            selectedTab: 1
        };
        this.test = 1;
        // this.databaseURL = 'http://localhost:3001'; // Local
        this.databaseURL = 'https://sleepy-harbor-88560.herokuapp.com'; // Heroku

        this.path = '/'; // Local
        // this.path = '/spring-racing-tipping/'; // Github
    }

    /* Determines whether React should re-render the component, in this case if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState === this.state);
    }

    /* Asyncronously get all the data, either from local JSON files while in development, or the database */
    async getData() {
        const self = this;
        try {
            // Used for local JSON files
            const competitionsResponse = await fetch(this.path + 'mock/competitions.json');
            const competitions = await competitionsResponse.json();
            const meetsResponse = await fetch(this.path + 'mock/meets.json');
            const meets = await meetsResponse.json();
            const racesResponse = await fetch(this.path + 'mock/races.json');
            const races = await racesResponse.json();
            const puntersResponse = await fetch(this.path + 'mock/punters.json');
            const punters = await puntersResponse.json();
            const tipsResponse = await fetch(this.path + 'mock/tips.json');
            const tips = await tipsResponse.json();
            let selectedMeet = this.state.selectedMeet;
            let selectedRace = this.state.selectedRace;

            // If no selected meet, set to the first meet
            if (!selectedMeet) {
                selectedMeet = meets.length ? meets[0]._id : null;
            }
            // If no selected race, set to the first race of the race meet
            if (!selectedRace) {
                for (let i = 0, j = races.length; i < j; i++) {
                    if (races[i].meetId === selectedMeet && races[i].number === 1) {
                        selectedRace = races[i]._id;
                    }
                }
            }

            self.setState({
                competitions: competitions,
                meets: meets,
                races: races,
                punters: punters,
                tips: tips,
                selectedMeet: selectedMeet,
                selectedRace: selectedRace
            });

            // Used for data coming from database
            // axios.all([
            //     axios.get(this.databaseURL + '/competitions'),
            //     axios.get(this.databaseURL + '/meets'),
            //     axios.get(this.databaseURL + '/races'),
            //     axios.get(this.databaseURL + '/punters'),
            //     axios.get(this.databaseURL + '/tips')
            // ]).then(axios.spread(function (competitions, meets, races, punters, tips) {
            //     // If no selected meet, set to the first meet, and set first race
            //     if (this.state.selectedMeet === null) {
            //         var firstMeet = meets.length ? meets[0]._id : null;
            //         var firstRace;
            //         for (let i = 0, j = races.length; i < j; i++) {
            //             if (races[i].meetId === firstMeet && races[i].number === 1) {
            //                 firstRace = races[i]._id;
            //             }
            //         }
            //     }

            //     self.setState({
            //         competitions: competitions.data,
            //         meets: meets.data,
            //         races: races.data,
            //         punters: punters.data,
            //         tips: tips.data,
            //         selectedMeet: firstMeet,
            //         selectedRace: firstRace
            //     });
            // })
            // ).catch(function (e) {
            //    console.log('An Axios error occurred: ' + e);
            // });
        } catch (e) {
            console.log('An error occurred: ' + e);
        }
    }

    /* Runs when the component first mounts and calls getData and checks for and sets state that was stored in localStorage */
    componentDidMount() {
        // Load all the data
        this.getData();
        // Check the localStorage to see if the user is already logged in
        if (localStorage.getItem('user')) {
            this.setState({
                authenticated: true,
                user: parseInt(localStorage.getItem('user'), 10),
                isAdmin: localStorage.getItem('isAdmin') === 'true',
                selectedMeet: parseInt(localStorage.getItem('selectedMeet'), 10) || null,
                selectedRace: parseInt(localStorage.getItem('selectedRace'), 10) || null
            });
        }
    }

    /* When the user logs in set the state and store them in localStorage */
    handleLogin = user => {
        const isAdmin = this.state.selectedCompetition.admins.includes(user);
        // Update the state with the user, and whether they are an admin
        this.setState({
            authenticated: true,
            user: user,
            isAdmin: isAdmin
        });
        // Set the localStorage for the logged in user
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', isAdmin);
    };

    /* When the user clicks the reload button, request the data again */
    handleReloadData = () => {
        this.getData();
    };

    /* When the user selects a race meet, update the state and save to localStorage */
    handleMeetSelect = event => {
        const races = this.state.races;
        const chosenMeet = parseInt(event.target.value, 10);
        let firstRace;
        for (let i = 0, j = races.length; i < j; i++) {
            if (races[i].meetId === chosenMeet && races[i].number === 1) {
                firstRace = races[i]._id;
            }
        }
        this.setState({
            selectedMeet: chosenMeet,
            selectedRace: firstRace
        });
        localStorage.setItem('selectedMeet', event.target.value);
    };

    /* When the user selects a race on the Results page, update the state */
    handleRaceSelect = event => {
        this.setState({
            selectedRace: parseInt(event.target.id, 10)
        });
    };

    /* When the user selects a tab on the Statistics page, update the state */
    handleTabSelect = tab => {
        this.setState({
            selectedTab: tab
        });
    };

    /* When the user selects a tip on the Tips page, get an updated copy of the tips from the database
       then update it, save back to the database and update the state */
    handleSaveTips = (modifiedRace, modifiedTips) => {
        axios.get(this.databaseURL + '/tips').then(returnedTips => {
            let tips = this.state.tips;
            let tipsMeet = returnedTips.data.find(meet => {
                return meet.meetId === this.state.selectedMeet;
            });
            const punter = tipsMeet.races[modifiedRace - 1].punters.find(punter => {
                return punter._id === this.state.user;
            });
            const meetIndex = returnedTips.data.indexOf(tipsMeet);
            const punterIndex = returnedTips.data[meetIndex].races[modifiedRace - 1].punters.indexOf(punter);

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
    };

    /* When the user clicks Save for placings on the Admin page, save to the database and update the state */
    handleSavePlacings = (modifiedRace, modifiedPlacings) => {
        let meets = this.state.meets;
        let meet = meets.find(meet => {
            return meet.meetId === this.state.selectedMeet;
        });
        const meetIndex = meets.indexOf(meet);

        // Update the placings for the selected meet/race
        meet.races[modifiedRace - 1].placings = modifiedPlacings;

        // Insert the updated meet back into the meets array
        meets[meetIndex] = meet;

        // Send the updated meet to the database
        axios.put(this.databaseURL + '/meets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated meets array
        this.setState({
            meets: meets
        });
    };

    /* When the user selects a race status on the Admin page, save to the database and update the state */
    handleSaveStatus = event => {
        let meets = this.state.meets;
        let meet = meets.find(meet => {
            return meet.meetId === this.state.selectedMeet;
        });
        const meetIndex = meets.indexOf(meet);

        // Update the placings for the selected meet/race
        meet.races[event.target.getAttribute('data-race') - 1].status = event.target.getAttribute('data-status');

        // Insert the updated meet back into the meets array
        meets[meetIndex] = meet;

        // Send the updated meet to the database
        axios.put(this.databaseURL + '/meets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated meets array
        this.setState({
            meets: meets
        });
    };

    /* When the user selects a scratching on the Admin page, save to the database and update the state */
    handleSaveScratchings = (modifiedRace, modifiedScratchings) => {
        let meets = this.state.meets;
        let meet = meets.find(meet => {
            return meet.meetId === this.state.selectedMeet;
        });
        const meetIndex = meets.indexOf(meet);

        // Update the placings for the selected meet/race
        meet.races[modifiedRace - 1].scratchings = modifiedScratchings;

        // Insert the updated meet back into the meets array
        meets[meetIndex] = meet;

        // Send the updated meet to the database
        axios.put(this.databaseURL + '/meets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated meets array
        this.setState({
            meets: meets
        });
    };

    /* Function to render the component */
    render() {
        if (this.state.meets.length) {
            return (
                // React Router routes to a particular component based on the URL path
                <Router>
                    <ScrollToTop>
                        <ErrorHandling>
                            <Switch>
                                <Route
                                    exact
                                    path={this.path + 'login'}
                                    render={routeProps => (
                                        <Login
                                            {...routeProps}
                                            path={this.path}
                                            punters={this.state.punters}
                                            handleLogin={this.handleLogin}
                                            authenticated={this.state.authenticated}
                                            user={this.state.user}
                                            isAdmin={this.state.isAdmin}
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path={this.path + 'admin'}
                                    render={routeProps =>
                                        this.state.authenticated && this.state.isAdmin ? (
                                            <Admin
                                                {...routeProps}
                                                path={this.path}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                selectedMeet={this.state.selectedMeet}
                                                onReloadData={this.handleReloadData}
                                                onMeetChange={this.handleMeetSelect}
                                                onPlacingsChange={this.handleSavePlacings}
                                                onStatusChange={this.handleSaveStatus}
                                                onScratchingChange={this.handleSaveScratchings}
                                                user={this.state.user}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'login'} />
                                        )
                                    }
                                />
                                <Route
                                    exact
                                    path={this.path + 'information'}
                                    render={routeProps =>
                                        this.state.authenticated ? (
                                            <Information
                                                {...routeProps}
                                                path={this.path}
                                                punters={this.state.punters}
                                                onReloadData={this.handleReloadData}
                                                authenticated={this.state.authenticated}
                                                user={this.state.user}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'login'} />
                                        )
                                    }
                                />
                                <Route
                                    exact
                                    path={this.path + 'statistics'}
                                    render={routeProps =>
                                        this.state.authenticated ? (
                                            <Statistics
                                                {...routeProps}
                                                path={this.path}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                tips={this.state.tips}
                                                selectedTab={this.state.selectedTab}
                                                onTabSelect={this.handleTabSelect}
                                                onReloadData={this.handleReloadData}
                                                authenticated={this.state.authenticated}
                                                user={this.state.user}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'login'} />
                                        )
                                    }
                                />
                                <Route
                                    exact
                                    path={this.path + 'tips'}
                                    render={routeProps =>
                                        this.state.authenticated ? (
                                            <Tips
                                                {...routeProps}
                                                path={this.path}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                tips={this.state.tips}
                                                punters={this.state.punters}
                                                selectedMeet={this.state.selectedMeet}
                                                selectedRace={this.state.selectedRace}
                                                onReloadData={this.handleReloadData}
                                                onMeetChange={this.handleMeetSelect}
                                                onSelectionChange={this.handleSaveTips}
                                                user={this.state.user}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'login'} />
                                        )
                                    }
                                />
                                <Route
                                    exact
                                    path={this.path + 'results'}
                                    render={routeProps =>
                                        this.state.authenticated ? (
                                            <Results
                                                {...routeProps}
                                                path={this.path}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                tips={this.state.tips}
                                                selectedMeet={this.state.selectedMeet}
                                                selectedRace={this.state.selectedRace}
                                                onReloadData={this.handleReloadData}
                                                onMeetChange={this.handleMeetSelect}
                                                onRaceChange={this.handleRaceSelect}
                                                user={this.state.user}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'login'} />
                                        )
                                    }
                                />
                                <Route
                                    exact
                                    path={this.path + 'leaderboard'}
                                    render={routeProps =>
                                        this.state.authenticated ? (
                                            <Leaderboard
                                                {...routeProps}
                                                path={this.path}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                tips={this.state.tips}
                                                user={this.state.user}
                                                onReloadData={this.handleReloadData}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'login'} />
                                        )
                                    }
                                />
                                <Redirect from="/" to={this.path + 'results'} />
                            </Switch>
                        </ErrorHandling>
                    </ScrollToTop>
                </Router>
            );
        } else {
            return <div />;
        }
    }
}

// Use to time functions

//const t0 = performance.now(); <- Put before code to be timed
//const t1 = performance.now(); <- Put after code to be timed
//console.log("Code took " + (t1 - t0) + " milliseconds.");
