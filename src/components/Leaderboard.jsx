import React, { Component } from 'react';
// import Header from './Header';
import Menu from './Menu';

export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        let points = [],
            a = this.props.punters.length,
            b = this.props.raceMeets.length,
            c,
            tipMeet,
            tips;
        // Load each punter into the points array with a score of 0
        while (a--) {
            points.push({ [this.props.punters[a].punterId]: 0 });
        }

        // For each race meet
        while (b--) {
            c = this.props.raceMeets[b].races.length;
            // For each meet race
            while (c--) {
                // Find race meet in tips, and then get the associated tips
                tipMeet = this.props.tips.find(meet => { return meet.meetId === this.props.raceMeets[b].meetId });
                tips = tipMeet.races.find(race => { return race.number === this.props.raceMeets[b].races[c].number });
                console.log(tips);
            }
        }

        return (
            <div className="app">
                {/* <Header /> */}
                <div>This is the Leaderboard page.</div>
                <Menu></Menu>
            </div>
        );
    }
}