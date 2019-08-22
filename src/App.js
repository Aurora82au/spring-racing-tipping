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
import { generateId } from './helpers/utilities';
import './App.css';

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
            user: null,
            isAdmin: false,
            selectedCompetition: null,
            selectedMeet: null,
            selectedRace: null,
            selectedTab: 1
        };

        this.useJSON = false;
        this.backendURL = 'http://localhost:4001'; // Local
        // this.backendURL = 'https://sleepy-harbor-88560.herokuapp.com'; // Heroku
        this.path = '/'; // Local
        // this.path = '/spring-racing-tipping/'; // Github
    }

    /* Determines whether React should re-render the component, in this case if the new state is different from the current state. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState === this.state);
    }

    /* Asyncronously get all the punters, either from a local JSON file while in development, or the database. */
    async getPunters() {
        const self = this;
        const dataURL = self.useJSON ? `${self.path}mock/punters.json` : `${self.backendURL}/punters`;
        try {
            const puntersResponse = await fetch(dataURL, { cache: 'no-store', mode: 'cors' });
            const punters = await puntersResponse.json();

            self.setState({
                punters: punters
            });

            return 'complete';
        } catch (e) {
            console.log('An error occurred: ' + e);
            return 'fail';
        }
    }

    /* Asyncronously get the competitions the user is in, either from a local JSON file while in development, or the database. */
    async getUserCompetitions(selectedUser) {
        const self = this;
        const dataURL = self.useJSON ? `${self.path}mock/competitions.json` : `${self.backendURL}/competitions/bypunter/${selectedUser}`;
        try {
            const competitionsResponse = await fetch(dataURL, { cache: 'no-store', mode: 'cors' });
            const competitions = await competitionsResponse.json();

            self.setState({
                competitions: competitions
            });

            return 'complete';
        } catch (e) {
            console.log('An error occurred: ' + e);
            return 'fail';
        }
    }

    /* Asyncronously get all the meets, races and tips data, either from local JSON files while in development, or the database. */
    async getData(selectedCompetition) {
        const self = this;
        const meetsDataURL = self.useJSON ? `${self.path}mock/meets.json` : `${self.backendURL}/meets/bycompetition/${selectedCompetition}`;
        const racesDataURL = self.useJSON ? `${self.path}mock/races.json` : `${self.backendURL}/races/bycompetition/${selectedCompetition}`;
        const tipsDataURL = self.useJSON ? `${self.path}mock/tips.json` : `${self.backendURL}/tips/bycompetition/${selectedCompetition}`;
        try {
            // Used for local JSON files
            // TODO: Fetch only the meets, races and tips for a competition
            const meetsResponse = await fetch(meetsDataURL, { cache: 'no-store', mode: 'cors' });
            const meets = await meetsResponse.json();
            const racesResponse = await fetch(racesDataURL, { cache: 'no-store', mode: 'cors' });
            const races = await racesResponse.json();
            const tipsResponse = await fetch(tipsDataURL, { cache: 'no-store', mode: 'cors' });
            const tips = await tipsResponse.json();
            let selectedMeet = self.state.selectedMeet || parseInt(localStorage.getItem('selectedMeet')) || null;
            let selectedRace = self.state.selectedRace;

            // If no selected meet, set to the first meet
            if (!selectedMeet) {
                selectedMeet = meets.length ? meets[0]._id : null;
                localStorage.setItem('selectedMeet', selectedMeet);
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
                meets: meets,
                races: races,
                tips: tips,
                selectedMeet: selectedMeet,
                selectedRace: selectedRace
            });

            // Used for data coming from database
            // axios.all([
            //     axios.get(self.backendURL + '/competitions'),
            //     axios.get(self.backendURL + '/meets'),
            //     axios.get(self.backendURL + '/races'),
            //     axios.get(self.backendURL + '/punters'),
            //     axios.get(self.backendURL + '/tips')
            // ]).then(axios.spread(function (competitions, meets, races, punters, tips) {
            //     // If no selected meet, set to the first meet, and set first race
            //     if (self.state.selectedMeet === null) {
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

    /* Runs when the component first mounts and checks if the user is already logged in,
     * and if so, then retrieves all data and sets state that was stored in localStorage.
     * Otherwise, it will be on the login screen, so only retrieves the punters. */
    componentDidMount() {
        // Check the localStorage to see if the user is already logged in
        if (localStorage.getItem('user')) {
            const userId = parseInt(localStorage.getItem('user'), 10);

            // Load all the data
            this.getPunters().then(result => {
                if (result === 'complete') {
                    const selectedUser = this.state.punters.find(user => {
                        return user._id === userId;
                    });
                    this.setState({
                        user: selectedUser
                    });
                }
            });
            this.getUserCompetitions(userId).then(result => {
                if (result === 'complete') {
                    const selectedCompetitionId = parseInt(localStorage.getItem('selectedCompetitionId'), 10);
                    if (selectedCompetitionId) {
                        let selectedCompetition;
                        for (let i = 0, l = this.state.competitions.length; i < l; i++) {
                            if (selectedCompetitionId === this.state.competitions[i]._id) {
                                selectedCompetition = this.state.competitions[i];
                            }
                        }
                        this.setState({
                            selectedCompetition: selectedCompetition
                        });
                        this.getData(selectedCompetitionId);
                    }
                }
            });

            this.setState({
                authenticated: true,
                isAdmin: localStorage.getItem('isAdmin') === 'true'
            });
        }
        else {
            // Load only the punters
            this.getPunters();
        }
    }

    /* When the user logs in set the state and store them in localStorage. */
    handleLogin = userId => {
        const userObj = this.state.punters.find(user => {
            return user._id === userId;
        });

        // Update the state with the user
        this.setState({
            authenticated: true,
            user: userObj
        });
        // Set the localStorage for the logged in user
        localStorage.setItem('user', userId);
        // Get the competitions the user is apart of
        this.getUserCompetitions(userId);
    };

    /* When the user selects a competition, update the state and whether they are an admin of that competition, and save to localStorage. */
    handleCompetitionSelect = event => {
        const competitionId = event.target.value ? event.target.value : event.target.getAttribute('data-value');
        let selectedCompetition;
        for (let i = 0, l = this.state.competitions.length; i < l; i++) {
            if (competitionId === this.state.competitions[i]._id.toString()) {
                selectedCompetition = this.state.competitions[i];
                break;
            }
        }
        const isAdmin = selectedCompetition.admins.includes(this.state.user._id);
        this.setState({
            selectedCompetition: selectedCompetition,
            isAdmin: isAdmin
        });
        localStorage.setItem('selectedCompetitionId', competitionId);
        localStorage.setItem('isAdmin', isAdmin);
        this.getData(competitionId);
    }

    /* When the user clicks the reload button, spin the icon and request the data again. */
    handleReloadData = event => {
        const btn = event.target.classList.contains('icon-reload') ? event.target.parentElement : event.target;
        btn.classList.add('loading');
        this.getData(this.state.selectedCompetition._id)
            .then(() => {
                btn.classList.remove('loading');
            });
    };

    /* When the user selects a race meet, update the state and save to localStorage. */
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

    /* When the user selects a race on the Results page, update the state. */
    handleRaceSelect = event => {
        this.setState({
            selectedRace: parseInt(event.target.id, 10)
        });
    };

    /* When the user selects a tab on the Statistics page, update the state. */
    handleTabSelect = tab => {
        this.setState({
            selectedTab: tab
        });
    };

    /* When the user selects a tip on the Tips page, save back to the database and update the state. */
    handleSaveTips = modifiedTips => {
        const self = this;
        if (!self.useJSON) {
            let tips = self.state.tips;
            let newTip;

            // Updating tips that have already been saved before.
            if (modifiedTips.databaseId) {
                // Get the current saved tip
                for (let i = 0, l = tips.length; i < l; i++) {
                    if (tips[i]._id === modifiedTips.databaseId) {
                        newTip = tips[i];
                        break;
                    }
                }

                if (newTip) {
                    // Update the selections
                    newTip.selections = modifiedTips.selections;

                    fetch(`${self.backendURL}/tips/${modifiedTips.databaseId}`, {
                        method: 'PUT',
                        cache: 'no-store',
                        mode: 'cors',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({'selections': newTip.selections})
                    })
                    .catch(error => console.error('Fetch error:', error));

                    tips.push(newTip);

                    self.setState({
                        tips: tips
                    });
                }
            }
            // Saving new tips.
            else {
                newTip = {
                    _id: generateId(8),
                    competitionId: self.state.selectedCompetition._id,
                    meetId: self.state.selectedMeet,
                    raceId: null,
                    punterId: self.state.user._id,
                    selections: modifiedTips.selections
                }

                // Find and set the raceId
                let races = this.state.races;
                for (let i = 0, l = races.length; i < l; i++) {
                    if (races[i].meetId === this.state.selectedMeet &&
                        races[i].number === modifiedTips.number) {
                        newTip.raceId = races[i]._id;
                        break;
                    }
                }

                fetch(`${self.backendURL}/tips`, {
                    method: 'POST',
                    cache: 'no-store',
                    mode: 'cors',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTip)
                })
                .catch(error => console.error('Fetch error:', error));

                tips.push(newTip);

                self.setState({
                    tips: tips
                });
            }
        }
    }

    /* When the user selects a tip on the Tips page, get an updated copy of the tips from the database
       then update it, save back to the database and update the state */
    handleSaveTipsOld = modifiedTips => {
        // axios.get(this.backendURL + '/tips').then(returnedTips => {
        //     let tips = this.state.tips;
        //     let tipsMeet = returnedTips.data.find(meet => {
        //         return meet.meetId === this.state.selectedMeet;
        //     });
        //     const punter = tipsMeet.races[modifiedRace - 1].punters.find(punter => {
        //         return punter._id === this.state.user;
        //     });
        //     const meetIndex = returnedTips.data.indexOf(tipsMeet);
        //     const punterIndex = returnedTips.data[meetIndex].races[modifiedRace - 1].punters.indexOf(punter);

        //     // Update the tips for the selected meet/race
        //     tipsMeet.races[modifiedRace - 1].punters[punterIndex].tips = modifiedTips.selections;

        //     // Insert the updated meet back into the tips array
        //     tips[meetIndex] = tipsMeet;

        //     // Send the updated tips to the database
        //     axios.put(this.backendURL + '/tips/' + this.state.selectedMeet, tipsMeet);

        //     // Update the local state with the updated tips array
        //     this.setState({
        //         tips: tips
        //     });
        // });
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
        axios.put(this.backendURL + '/meets/' + this.state.selectedMeet, meet);

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
        axios.put(this.backendURL + '/meets/' + this.state.selectedMeet, meet);

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
        axios.put(this.backendURL + '/meets/' + this.state.selectedMeet, meet);

        // Update the local state with the updated meets array
        this.setState({
            meets: meets
        });
    };

    /* Function to render the component */
    render() {
        if (this.state.punters.length) {
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
                                        !this.state.selectedCompetition ? (
                                            <Login
                                                {...routeProps}
                                                path={this.path}
                                                punters={this.state.punters}
                                                competitions={this.state.competitions}
                                                handleLogin={this.handleLogin}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
                                                authenticated={this.state.authenticated}
                                                user={this.state.user}
                                                isAdmin={this.state.isAdmin}
                                            />
                                        ) : (
                                            <Redirect to={this.path + 'results'} />
                                        )
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
                                                selectedCompetition={this.state.selectedCompetition}
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
                                                selectedCompetition={this.state.selectedCompetition}
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
                                                selectedCompetition={this.state.selectedCompetition}
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
                                                selectedCompetition={this.state.selectedCompetition}
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
                                                selectedCompetition={this.state.selectedCompetition}
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
                                                selectedCompetition={this.state.selectedCompetition}
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
