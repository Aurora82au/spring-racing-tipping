import React, { Component } from 'react';
// import Header from './Header';
import Menu from './Menu';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelected: 1
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }

    componentDidMount() {
        this.setState({
            tabSelected: this.props.selectedTab
        });
    }

    handleTabClick = event => {
        let tab = 1;
        if (event.target.classList.contains('two')) { tab = 2; }
        this.setState({
            tabSelected: tab
        });
        this.props.onTabSelect(tab);
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

    createStatArray = (stats, arrayToUpdate, arrayToUpdateName) => {
        let stat, punter;
        
        for (let i = 0, len = stats.length; i < len; i++) {
            // Set the correct stat data according to the array to update
            switch (arrayToUpdateName) {
                case 'trifectas': stat = stats[i].trifectas; break;
                case 'quinellas': stat = stats[i].quinellas; break;
                case 'firsts': stat = stats[i].firsts; break;
                case 'seconds': stat = stats[i].seconds; break;
                case 'thirds': stat = stats[i].thirds; break;
                default: break;
            }
            // Get the current punters details
            punter = this.findPunter(stats[i].punterId);
            // Create the stat item and add to the array to update
            arrayToUpdate.push(<div key={i} className="stat-item">
                                   <img src={'pics/' + punter.pic} alt="Profile pic" className="pic" />
                                   <div className="name">{punter.name.first}</div>
                                   <div className="stat">{stat}</div>
                               </div>);
        }
    }

    render() {
        let stats = this.calculateStats(),
            trifectas = [], quinellas = [], firsts = [], seconds = [], thirds = [],
            tabBtn1Class, tabBtn2Class, tab1Class, tab2Class;
        console.log(stats);

        // Sort punters in descending order by trifectas
        stats.sort((a, b) => { return b.trifectas - a.trifectas; });

        // Create list of punters in order of trifectas
        this.createStatArray(stats, trifectas, 'trifectas');

        // Sort punters in descending order by quinellas
        stats.sort((a, b) => { return b.quinellas - a.quinellas; });

        // Create list of punters in order of quinellas
        this.createStatArray(stats, quinellas, 'quinellas');

        // Sort punters in descending order by firsts
        stats.sort((a, b) => { return b.firsts - a.firsts; });

        // Create list of punters in order of firsts
        this.createStatArray(stats, firsts, 'firsts');

        // Sort punters in descending order by seconds
        stats.sort((a, b) => { return b.seconds - a.seconds; });

        // Create list of punters in order of firsts
        this.createStatArray(stats, seconds, 'seconds');

        // Sort punters in descending order by thirds
        stats.sort((a, b) => { return b.thirds - a.thirds; });

        // Create list of punters in order of firsts
        this.createStatArray(stats, thirds, 'thirds');

        // Set the tab status and hide/show the tabs
        if (this.state.tabSelected === 1) {
            tabBtn1Class = 'btn tab-btn one selected';
            tabBtn2Class = 'btn tab-btn two';
            tab1Class = '';
            tab2Class = 'hide';
        }
        else {
            tabBtn1Class = 'btn tab-btn one';
            tabBtn2Class = 'btn tab-btn two selected';
            tab1Class = 'hide';
            tab2Class = '';
        }

        return (
            <div className="app">
                {/* <Header page="Statistics" path={this.props.path} punters={this.props.punters} user={this.props.user} onReloadData={this.props.onReloadData} isAdmin={this.props.isAdmin} text="Here you can find various statistics, such as the placings for each race meet, number of trifectas, quinellas, 1sts, 2nds, 3rds, etc." /> */}
                <div className="tab-btns">
                    <button className={tabBtn1Class} onClick={this.handleTabClick}>Meets</button>
                    <button className={tabBtn2Class} onClick={this.handleTabClick}>Other</button>
                </div>
                <div className={tab1Class}>
                    <div>This is the Meets tab.</div>
                </div>
                <div className={tab2Class}>
                    <div className="bold mt-20 mb-10">Trifectas</div>
                    <div className="stat-container">{trifectas}</div>
                    <div className="bold mt-20 mb-10">Quinellas</div>
                    <div className="stat-container">{quinellas}</div>
                    <div className="bold mt-20 mb-10">Firsts</div>
                    <div className="stat-container">{firsts}</div>
                    <div className="bold mt-20 mb-10">Seconds</div>
                    <div className="stat-container">{seconds}</div>
                    <div className="bold mt-20 mb-10">Thirds</div>
                    <div className="stat-container">{thirds}</div>
                </div>
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}