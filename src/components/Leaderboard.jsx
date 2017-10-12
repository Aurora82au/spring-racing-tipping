import React, { Component } from 'react';
import Header from './Header';
import Podium from './Podium';
import Menu from './Menu';

export default class Leaderboard extends Component {
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

    findPuntersPoints = (points, punterId) => {
        return points.find(punter => { return punter.punterId === punterId });
    }

    calculatePoints = () => {
        let points = [],
            a = this.props.punters.length,
            b = this.props.raceMeets.length,
            c, d, placings, tipMeet, tips, puntersPoints;

        // Load each punter into the points array with a score of 0
        while (a--) {
            points.push({ "punterId": this.props.punters[a].punterId, "points": 0, "firsts": 0, "seconds": 0, "thirds": 0 });
        }

        // For each race meet
        while (b--) {
            c = this.props.raceMeets[b].races.length;
            // For each meet race
            while (c--) {
                // Set placings to the placings for this race
                placings = this.props.raceMeets[b].races[c].placings;
                // Find race meet in tips, and then get the associated tips
                tipMeet = this.findMeet(b);
                tips = this.findRace(tipMeet, b, c);
                d = tips.punters.length;
                // For each punters tips
                while (d--) {
                    puntersPoints = this.findPuntersPoints(points, tips.punters[d].punterId);
                    if (tips.punters[d].tips.includes(placings.first)) { puntersPoints.points += 3; puntersPoints.firsts++; }
                    if (tips.punters[d].tips.includes(placings.second)) { puntersPoints.points += 2; puntersPoints.seconds++; }
                    if (tips.punters[d].tips.includes(placings.third)) { puntersPoints.points += 1; puntersPoints.thirds++; }
                }
            }
        }

        return points;
    }
    
    render() {
        let points = this.calculatePoints(),
            loserList = [],
            first, second, third, punter, position;

        // Sort points in descending order by total points, then by first places, then by second places
        points.sort((a, b) => { return b.points - a.points || b.firsts - a.firsts || b.seconds - a.seconds });
        
        // Set winners
        first = this.findPunter(points[0].punterId);
        second = this.findPunter(points[1].punterId);
        third = this.findPunter(points[2].punterId);

        // Generate list of losers
        for (let i = 0; i < points.length; i++) {
            console.log('Punter ' + points[i].punterId + ' - 1sts: ' + points[i].firsts + ' - 2nds: ' + points[i].seconds + ' - 3rds: ' + points[i].thirds + ' - points: ' + points[i].points);
            if (i !== 0 && i !== 1 && i !== 2) {
                // Get the punter details
                punter = this.findPunter(points[i].punterId);

                // Get positon ending name (adding 1 to index to account for array starting from 0)
                if ((i + 1) % 10 === 1) { position = '<sup>ST</sup>' }
                else if ((i + 1) % 10 === 2) { position = '<sup>ND</sup>' }
                else if ((i + 1) % 10 === 3) { position = '<sup>RD</sup>' }
                else { position = '<sup>TH</sup>' }
                
                // Add them to the losers array
                loserList.push(<div key={i} className="loser">
                                   <span className="number" dangerouslySetInnerHTML={{__html: (i + 1) + position}}></span>
                                   <span className="points">{points[i].points} PTS</span>
                                   <img src={'pics/' + punter.pic} alt="Profile pic" className="pic" />
                                   <span className="name">{punter.name.first} {punter.name.last}</span>
                               </div>);
            }
        }
        
        return (
            <div className="app">
                <Header page="Leaderboard" path={this.props.path} punters={this.props.punters} user={this.props.user} isAdmin={this.props.isAdmin} text="To the victors go the spoils, and to the losers....go home." />
                <Podium first={first} second={second} third={third} points={points} />
                <h4 className="lb-heading">BEST OF THE REST</h4>
                {loserList}
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}