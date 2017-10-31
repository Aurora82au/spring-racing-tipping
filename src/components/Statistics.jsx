import React, { Component } from 'react';
// import Header from './Header';
// import Menu from './Menu';

export default class App extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    findMeet = thisMeetIndex => {
        return this.props.tips.find(tipsMeet => { return tipsMeet.meetId === this.props.raceMeets[thisMeetIndex].meetId });
    }

    findRace = (tipMeet, thisMeetIndex, thisRaceIndex) => {
        return tipMeet.races.find(tipsRace => { return tipsRace.number === this.props.raceMeets[thisMeetIndex].races[thisRaceIndex].number });
    }

    findPunter = punterId => {
        return this.props.punters.find(punter => { return punter.punterId === punterId });
    }

    findPuntersStats = (stats, punterId) => {
        return stats.find(punter => { return punter.punterId === punterId });
    }

    findPuntersStatsMeet = (puntersStats, meetId) => {
        return puntersStats.meets.find(meet => { return meet.meetId === meetId });
    }

    calculateStats = () => {
        let stats = [],
            a = this.props.punters.length,
            b = this.props.raceMeets.length,
            meetsArray = [],
            c, d, placings, tipMeet, tips, puntersStats, puntersStatsMeet, raceScore;

        // Create a meets array to hold the score for each meet.  This will be added to each punters stats.
        while (b--) {
            meetsArray.push({ "meetId": this.props.raceMeets[b].meetId, "score": 0 });
        }

        // Load each punter into the points array with a score of 0
        while (a--) {
            stats.push({
                "punterId": this.props.punters[a].punterId,
                "trifectas": 0,
                "quinellas": 0,
                "firsts": 0,
                "seconds": 0,
                "thirds": 0,
                "meets": meetsArray.map(a => ({...a})) // Use map and the spread operator to clone the array with cloned values, instead of references
            });
        }

        // Reset the length of the race meets after the first while loop
        b = this.props.raceMeets.length

        // For each meet
        while (b--) {
            c = this.props.raceMeets[b].races.length;
            // For each race in meet
            while (c--) {
                // Set placings to the placings for this race
                placings = this.props.raceMeets[b].races[c].placings;
                // Find race meet in tips, and then get the associated tips
                tipMeet = this.findMeet(b);
                tips = this.findRace(tipMeet, b, c);
                d = tips.punters.length;
                // For each punters tips
                while (d--) {
                    // Reset the race score
                    raceScore = 0;
                    // Get the current punter's stats from the stats array
                    puntersStats = this.findPuntersStats(stats, tips.punters[d].punterId);
                    // Get the current race meet from the current punter's stats
                    puntersStatsMeet = this.findPuntersStatsMeet(puntersStats, this.props.raceMeets[b].meetId);
                    // Update the stats of that punter
                    if (tips.punters[d].tips.includes(placings.first)) { puntersStats.firsts++; raceScore += 3; }
                    if (tips.punters[d].tips.includes(placings.second)) { puntersStats.seconds++; raceScore += 2; }
                    if (tips.punters[d].tips.includes(placings.third)) { puntersStats.thirds++; raceScore += 1; }
                    if (raceScore === 6) { puntersStats.trifectas++; }
                    if (raceScore === 5) { puntersStats.quinellas++; }
                    // Add the race score to this meets score
                    puntersStatsMeet.score += raceScore;
                }
            }
        }

        return stats;
    }

    render() {
        let stats = this.calculateStats(),
            trifectas = [], //quinellas = [], firsts = [], seconds = [], thirds = [],
            punter;
        console.log(stats);

        // Sort punters in descending order by trifectas
        stats.sort((a, b) => { return b.trifectas - a.trifectas; });

        // Create list of punters in order of trifectas
        for (let i = 0, len = stats.length; i < len; i++) {
            punter = this.findPunter(stats[i].punterId);
            trifectas.push(<div key={i} className="stat-item">
                               <img src={'pics/' + punter.pic} alt="Profile pic" className="pic" />
                               <div className="name">{punter.name.first} {punter.name.last}</div>
                               <div className="stat">{stats[i].trifectas}</div>
                           </div>);
        }

        return (
            <div className="app">
                {/* <Header page="Statistics" path={this.props.path} punters={this.props.punters} user={this.props.user} onReloadData={this.props.onReloadData} isAdmin={this.props.isAdmin} text="Here you can find various statistics, such as the placings for each race meet, number of trifectas, quinellas, 1sts, 2nds, 3rds, etc." /> */}
                <h3>Trifectas</h3>
                <div className="stat-container">{trifectas}</div>
                {/* <Menu path={this.props.path}></Menu> */}
            </div>
        );
    }
}