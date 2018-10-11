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

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            raceMeets: [],
            punters: [],
            tips: [],
            authenticated: false,
            user: 0,
            isAdmin: false,
            selectedMeet: 'TURNBULL',
            selectedRace: 1,
            selectedTab: 1,
            appLoadFailed: false,
            counter: 0
        };
        // this.databaseURL = 'http://localhost:3001'; // Local
        this.databaseURL = 'https://sleepy-harbor-88560.herokuapp.com'; // Heroku

        this.path = '/'; // Local
        //this.path = '/spring-racing-tipping/'; // Github

        this.counterInterval = null;
    }

    /* Determines whether React should re-render the component, in this case if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState === this.state);
    }

    /* Asyncronously get all the data, either from local JSON files while in development, or the database */
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
            axios
                .all([
                    axios.get(this.databaseURL + '/racemeets'),
                    axios.get(this.databaseURL + '/punters'),
                    axios.get(this.databaseURL + '/tips')
                ])
                .then(
                    axios.spread(function(meets, punters, tips) {
                        self.setState({
                            raceMeets: meets.data,
                            punters: punters.data,
                            tips: tips.data
                        });
                    })
                )
                .catch(function(e) {
                    console.log('An Axios error occurred: ' + e);
                });
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
                selectedMeet: localStorage.getItem('selectedMeet') || 'TURNBULL'
            });
        }
        // Start 30sec timer to check if app loaded
        setTimeout(() => {
            if (!this.state.punters.length) {
                this.setState({
                    appLoadFailed: true
                });
            }
        }, 30000);
        this.counterInterval = setInterval(() => {
            if (!this.state.punters.length) {
                const count = this.state.counter;
                const newCount = count + 1;
                this.setState({
                    counter: newCount
                });
            }
            else {
                clearInterval(this.counterInterval);
            }
        }, 1000);
    }

    /* When the user logs in set the state and store them in localStorage */
    handleLogin = (user, isAdmin) => {
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
        this.setState({
            selectedMeet: event.target.value,
            selectedRace: 1
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
            let tips = this.state.tips,
                tipsMeet = returnedTips.data.find(meet => {
                    return meet.meetId === this.state.selectedMeet;
                }),
                punter = tipsMeet.races[modifiedRace - 1].punters.find(punter => {
                    return punter.punterId === this.state.user;
                }),
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
    };

    /* When the user clicks Save for placings on the Admin page, save to the database and update the state */
    handleSavePlacings = (modifiedRace, modifiedPlacings) => {
        let raceMeets = this.state.raceMeets,
            meet = raceMeets.find(meet => {
                return meet.meetId === this.state.selectedMeet;
            }),
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
    };

    /* When the user selects a race status on the Admin page, save to the database and update the state */
    handleSaveStatus = event => {
        let raceMeets = this.state.raceMeets,
            meet = raceMeets.find(meet => {
                return meet.meetId === this.state.selectedMeet;
            }),
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
    };

    /* When the user selects a scratching on the Admin page, save to the database and update the state */
    handleSaveScratchings = (modifiedRace, modifiedScratchings) => {
        let raceMeets = this.state.raceMeets,
            meet = raceMeets.find(meet => {
                return meet.meetId === this.state.selectedMeet;
            }),
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
    };

    /* Function to render the component */
    render() {
        if (this.state.raceMeets.length) {
            return (
                // React Router routes to a particular component based on the URL path
                <Router>
                    <ScrollToTop>
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
                                            raceMeets={this.state.raceMeets}
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
                                            raceMeets={this.state.raceMeets}
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
                                            raceMeets={this.state.raceMeets}
                                            tips={this.state.tips}
                                            punters={this.state.punters}
                                            selectedMeet={this.state.selectedMeet}
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
                                            raceMeets={this.state.raceMeets}
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
                                            raceMeets={this.state.raceMeets}
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
                    </ScrollToTop>
                </Router>
            );
        } else if (this.state.appLoadFailed) {
            return (
                <div className="timeout-msg">
                    <img src="steve.gif" alt="Steve Harvey - What's wrong withchu?" />
                    <p>It seems like something has gone wrong with the database...</p>
                    <p>Curse you free Heroku account!</p>
                    <p>*shakes fist at the sky*</p>
                </div>
            );
        } else {
            return (
                <div className="loading-msg">
                    <img src="cat.gif" alt="Cat swinging its tail" />
                    <div className="text">LOADING...</div>
                    <div>{this.state.counter} seconds</div>
                </div>
            );
        }
    }
}

// Use to time functions

//var t0 = performance.now(); <- Put before code to be timed
//var t1 = performance.now(); <- Put after code to be timed
//console.log("While loops took " + (t1 - t0) + " milliseconds.");
