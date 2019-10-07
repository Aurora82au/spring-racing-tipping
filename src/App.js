import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
            allPunters: [],
            tips: [],
            authenticated: null,
            user: null,
            isAdmin: false,
            selectedCompetition: null,
            selectedMeet: null,
            selectedRace: null,
            selectedTab: 1
        };

        this.useJSON = false;
        // this.backendURL = 'http://localhost:4001'; // Local
        // this.backendURL = 'https://sleepy-harbor-88560.herokuapp.com'; // Production v1 - Heroku
        this.backendURL = 'https://spring-racing-tipping-88560.herokuapp.com'; // Production v2 - Heroku
        this.path = '/'; // Local
        // this.path = '/spring-racing-tipping/'; // Github
    }

    /* Determines whether React should re-render the component, in this case if the new state is different from the current state. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState === this.state);
    }

    /* Asyncronously get all the punters, either from a local JSON file while in development, or the database. */
    async getAllPunters() {
        const self = this;
        const dataURL = self.useJSON ? `${self.path}mock/punters.json` : `${self.backendURL}/punters`;
        try {
            const puntersResponse = await fetch(dataURL, { cache: 'no-store', mode: 'cors' });
            const punters = await puntersResponse.json();

            self.setState({
                allPunters: punters
            });

            return 'complete';
        } catch (e) {
            console.log('An error occurred: ' + e);
            return 'fail';
        }
    }

    /* Get all the punters that are apart of the currently selected competition. */
    getCompetitionPunters(selectedCompetition) {
        return this.state.allPunters.filter(punter => {
            return selectedCompetition.punters.includes(punter._id);
        });
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
    async setData(selectedCompetition) {
        const self = this;
        const meetsDataURL = self.useJSON ? `${self.path}mock/meets-${selectedCompetition.startDate.split('-')[0]}.json`:
                                            `${self.backendURL}/meets/bycompetition/${selectedCompetition._id}`;
        const racesDataURL = self.useJSON ? `${self.path}mock/races-${selectedCompetition.startDate.split('-')[0]}.json` :
                                            `${self.backendURL}/races/bycompetition/${selectedCompetition._id}`;
        const tipsDataURL = self.useJSON ? `${self.path}mock/tips-${selectedCompetition.startDate.split('-')[0]}.json` :
                                            `${self.backendURL}/tips/bycompetition/${selectedCompetition._id}`;
        try {
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
                for (let i = 0, l = races.length; i < l; i++) {
                    if (races[i].meetId === selectedMeet && races[i].number === 1) {
                        selectedRace = races[i]._id;
                    }
                }
            }

            self.setState({
                meets: meets,
                races: races,
                tips: tips,
                punters: this.getCompetitionPunters(selectedCompetition),
                selectedCompetition: selectedCompetition,
                selectedMeet: selectedMeet,
                selectedRace: selectedRace
            });
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

            this.setState({
                authenticated: true,
                isAdmin: localStorage.getItem('isAdmin') === 'true'
            });

            // Load all the data
            this.getAllPunters().then(result => {
                if (result === 'complete') {
                    const selectedUser = this.state.allPunters.find(user => {
                        return user._id === userId;
                    });
                    this.setState({
                        user: selectedUser
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
                                this.setData(selectedCompetition);
                            }
                        }
                    });
                }
            });
        }
        else {
            this.setState({
                authenticated: false
            });

            // Load only the punters
            this.getAllPunters();
        }
    }

    /* When the user logs in set the state and store them in localStorage. */
    handleLogin = userId => {
        const userObj = this.state.allPunters.find(user => {
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
    handleCompetitionSelect = competition => {
        let competitionId;
        let meetId = null;
        let raceId = null;
        let selectedCompetition;
        let i, l;

        // Is a competition object.
        if (competition._id) {
            competitionId = competition._id;
            selectedCompetition = competition;
        }
        // Is a click object.
        else {
            // Set the id to either the value if it's a <select>, or data-value if it is a <li>.
            competitionId = competition.target.value ? competition.target.value : competition.target.getAttribute('data-value');
            for (let i = 0, l = this.state.competitions.length; i < l; i++) {
                if (competitionId === this.state.competitions[i]._id.toString()) {
                    selectedCompetition = this.state.competitions[i];
                    break;
                }
            }
        }

        // Reset the meetId.
        for (i = 0, l = this.state.meets.length; i < l; i++) {
            if (this.state.meets[i].competitionId === selectedCompetition._id) {
                meetId = this.state.meets[i]._id;
                break;
            }
        }
        // Reset the raceId.
        for (i = 0, l = this.state.races.length; i < l; i++) {
            if (this.state.races[i].meetId === meetId && this.state.races[i].number === 1) {
                raceId = this.state.races[i]._id;
                break;
            }
        }
        
        const isAdmin = selectedCompetition.admins.includes(this.state.user._id);
        this.setState({
            selectedMeet: meetId,
            selectedRace: raceId,
            isAdmin: isAdmin
        });
        localStorage.setItem('selectedCompetitionId', competitionId);
        localStorage.setItem('selectedMeet', meetId);
        localStorage.setItem('isAdmin', isAdmin);
        this.setData(selectedCompetition);
    }

    /* When the user clicks the reload button, spin the icon and request the data again. */
    handleReloadData = event => {
        const btn = event.target.classList.contains('icon-reload') ? event.target.parentElement : event.target;
        btn.classList.add('loading');
        this.setData(this.state.selectedCompetition)
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
                // Get a reference to the current saved tip
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

    /* When the user clicks Save for placings on the Admin page, save to the database and update the state */
    handleSavePlacings = (modifiedRaceId, modifiedPlacings) => {
        let races = this.state.races;
        let race = races.find(race => {
            return race._id === modifiedRaceId;
        });
        const raceIndex = races.indexOf(race);

        // Update the placings for the selected race
        race.placings = modifiedPlacings;

        // Insert the updated race back into the races array
        races[raceIndex] = race;

        // Update the race in the database and local state
        this.updateRace(modifiedRaceId, races, race);
    };

    /* When the user selects a race status on the Admin page, save to the database and update the state */
    handleSaveStatus = event => {
        const modifiedRaceId = parseInt(event.target.getAttribute('data-race-id'), 10);
        let races = this.state.races;
        let race = races.find(race => {
            return race._id === modifiedRaceId;
        });
        const raceIndex = races.indexOf(race);

        // Update the status for the selected race
        race.status = parseInt(event.target.getAttribute('data-status'), 10);

        // Insert the updated race back into the races array
        races[raceIndex] = race;

        // Update the race in the database and local state
        this.updateRace(modifiedRaceId, races, race);
    };

    /* When the user selects a scratching on the Admin page, save to the database and update the state */
    handleSaveScratchings = (modifiedRaceId, modifiedScratchings) => {
        let races = this.state.races;
        let race = races.find(race => {
            return race._id === modifiedRaceId;
        });
        const raceIndex = races.indexOf(race);

        // Update the placings for the selected race
        race.scratchings = modifiedScratchings;

        // Insert the updated race back into the races array
        races[raceIndex] = race;

        // Update the race in the database and local state
        this.updateRace(modifiedRaceId, races, race);
    };

    /* When the user selects a scratching on the Admin page, save to the database and update the state */
    updateRace = (modifiedRaceId, races, race) => {
        if (!this.useJSON) {
            // Send the updated race to the database
            fetch(`${this.backendURL}/races/${modifiedRaceId}`, {
                method: 'PUT',
                cache: 'no-store',
                mode: 'cors',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(race)
            })
            .catch(error => console.error('Fetch error:', error));
        }

        // Update the local state with the updated races array
        this.setState({
            races: races
        });
    };

    /* Function to render the component */
    render() {
        const page = window.location.href.split("/").slice(-1)[0];

        if ((this.state.selectedCompetition && this.state.punters.length) ||
            (page === 'login' && this.state.allPunters.length) ||
            (this.state.authenticated === false)) {
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
                                                competitions={this.state.competitions}
                                                allPunters={this.state.allPunters}
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
                                        this.state.authenticated &&
                                        this.state.selectedCompetition &&
                                        this.state.isAdmin ? (
                                            <Admin
                                                {...routeProps}
                                                path={this.path}
                                                competitions={this.state.competitions}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                selectedCompetition={this.state.selectedCompetition}
                                                selectedMeet={this.state.selectedMeet}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
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
                                        this.state.authenticated &&
                                        this.state.selectedCompetition ? (
                                            <Information
                                                {...routeProps}
                                                path={this.path}
                                                competitions={this.state.competitions}
                                                punters={this.state.punters}
                                                selectedCompetition={this.state.selectedCompetition}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
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
                                        this.state.authenticated &&
                                        this.state.selectedCompetition ? (
                                            <Statistics
                                                {...routeProps}
                                                path={this.path}
                                                competitions={this.state.competitions}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                tips={this.state.tips}
                                                selectedCompetition={this.state.selectedCompetition}
                                                selectedTab={this.state.selectedTab}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
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
                                        this.state.authenticated &&
                                        this.state.selectedCompetition ? (
                                            <Tips
                                                {...routeProps}
                                                path={this.path}
                                                competitions={this.state.competitions}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                tips={this.state.tips}
                                                punters={this.state.punters}
                                                selectedCompetition={this.state.selectedCompetition}
                                                selectedMeet={this.state.selectedMeet}
                                                selectedRace={this.state.selectedRace}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
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
                                        this.state.authenticated &&
                                        this.state.selectedCompetition ? (
                                            <Results
                                                {...routeProps}
                                                path={this.path}
                                                competitions={this.state.competitions}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                tips={this.state.tips}
                                                selectedCompetition={this.state.selectedCompetition}
                                                selectedMeet={this.state.selectedMeet}
                                                selectedRace={this.state.selectedRace}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
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
                                        this.state.authenticated &&
                                        this.state.selectedCompetition ? (
                                            <Leaderboard
                                                {...routeProps}
                                                path={this.path}
                                                competitions={this.state.competitions}
                                                meets={this.state.meets}
                                                races={this.state.races}
                                                punters={this.state.punters}
                                                tips={this.state.tips}
                                                user={this.state.user}
                                                selectedCompetition={this.state.selectedCompetition}
                                                handleCompetitionSelect={this.handleCompetitionSelect}
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
