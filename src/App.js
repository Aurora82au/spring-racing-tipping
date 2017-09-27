import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Tips from './components/Tips';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            punters: []
        }
    }

    async getData() {
        try {
            let punterResponse = await fetch('punters.json'),
                punters = await punterResponse.json();
            this.setState({
                punters: punters
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
        return (
            <Router>
                <Switch>
                    <Route exact path="/tips" component={Tips} />
                    <Route exact path="/results" render={routeProps => <Results {...routeProps} punters={this.state.punters}/>} />
                    <Route exact path="/leaderboard" component={Leaderboard} />
                    <Redirect from='/' to='/results' />
                </Switch>
            </Router>
        );
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